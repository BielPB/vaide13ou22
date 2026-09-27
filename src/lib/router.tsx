import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { prefersReducedMotion } from './format'

/**
 * Roteador mínimo (History API), sem dependências.
 * Troca de página com transição suave (View Transitions) quando o navegador
 * suporta e o visitante não pediu menos movimento.
 */
const EVENT = 'app:navigate'

function subscribe(cb: () => void) {
  window.addEventListener('popstate', cb)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener(EVENT, cb)
  }
}

export function usePathname() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => '/',
  )
}

/** Depois da troca: vai para a âncora (se houver) ou para o topo, e leva o foco ao título. */
function settle(hash: string) {
  const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
  if (target) {
    target.scrollIntoView({ block: 'start' })
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const h1 = document.querySelector('h1')
    if (h1) {
      if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1')
      h1.focus({ preventScroll: true })
    }
  }
}

export function navigate(to: string) {
  const url = new URL(to, window.location.href)
  // Mesma página: vai para a âncora (o navegador rola, com scroll-behavior suave) ou,
  // sem âncora (ex.: clique na logo já no início), volta ao topo e limpa o "#" do endereço.
  if (url.pathname === window.location.pathname) {
    if (url.hash) {
      window.location.hash = url.hash
    } else {
      if (window.location.hash) history.replaceState(null, '', url.pathname + url.search)
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    }
    return
  }
  const go = () => {
    history.pushState(null, '', url.pathname + url.search + url.hash)
    flushSync(() => window.dispatchEvent(new Event(EVENT)))
    settle(url.hash)
  }
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  if (doc.startViewTransition && !prefersReducedMotion()) doc.startViewTransition(go)
  else go()
}

/** Link interno: navega sem recarregar. Cliques com Ctrl/Cmd/Shift ou botão do meio seguem o padrão do navegador. */
export function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target) return
    e.preventDefault()
    navigate(href)
  }
  return <a href={href} onClick={handle} {...rest} />
}
