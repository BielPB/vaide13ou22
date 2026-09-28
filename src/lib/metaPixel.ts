/**
 * Meta Pixel (instalado a pedido do vendedor em 28/09/2026).
 *
 * O ID vem da variável de ambiente VITE_META_PIXEL_ID (configurada na Vercel),
 * nunca do código: o repositório é público. Sem o ID, nada é carregado.
 *
 * Só envia PageView. Nenhum evento com produto, lado (13/22), carrinho ou compra,
 * e a coleta automática da Meta (cliques e conteúdo da página) fica desligada.
 * O site envia a primeira visita; as trocas de página seguintes (o site não recarrega)
 * são registradas pelo próprio pixel, que acompanha as mudanças de endereço.
 */
type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push: Fbq
  loaded: boolean
  version: string
}

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

const PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID ?? '').trim()

export const metaPixelEnabled = /^\d{10,20}$/.test(PIXEL_ID)

/** Carrega o script da Meta uma vez (mesmo trecho do código oficial). */
function load(): Fbq {
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  } as Fbq
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  window.fbq = fbq
  window._fbq ??= fbq

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  fbq('set', 'autoConfig', false, PIXEL_ID)
  fbq('init', PIXEL_ID)
  return fbq
}

/** Carrega o pixel e registra a primeira visita (chamado uma vez, ao abrir o site). */
export function startMetaPixel() {
  if (!metaPixelEnabled || typeof window === 'undefined' || window.fbq) return
  load()('track', 'PageView')
}
