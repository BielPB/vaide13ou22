import { useEffect, useId, useRef, useState } from 'react'
import { isExampleData } from '../config'
import { formatBRL } from '../lib/format'
import { allPending, hasEssential } from '../lib/pending'
import { useShop } from '../lib/shop'
import { ServiceBar } from './Home'

export function Wordmark() {
  return (
    <span className="wordmark" aria-hidden="true">
      <span className="wordmark__13">13</span>
      <span className="wordmark__x">×</span>
      <span className="wordmark__22">22</span>
    </span>
  )
}

function PreviewBanner() {
  const { config } = useShop()
  const pending = allPending(config)
  if (config.status === 'live' && !hasEssential(pending)) return null
  return (
    <div className="preview-banner" role="note">
      <div className="container preview-banner__inner">
        <strong>Prévia de demonstração.</strong>{' '}
        {isExampleData(config) ? 'Dados de exemplo fictícios; ' : ''}
        compra indisponível até a publicação.{' '}
        <a href="#pendencias">Ver {pending.filter((p) => p.level === 'essential').length} pendências</a>
      </div>
    </div>
  )
}

/** Faixa de oferta no topo — só aparece com valor configurado em commerce.freeShippingAboveCents. */
function PromoBar() {
  const { config } = useShop()
  const min = config.commerce.freeShippingAboveCents
  const region = config.commerce.freeShippingRegion
  if (min === null) return null
  return (
    <div className="promo-bar">
      <p className="container promo-bar__inner">
        <strong>Frete grátis{region ? ` para ${region}` : ''}</strong> em compras acima de {formatBRL(min)}
      </p>
    </div>
  )
}

const links = [
  { href: '#vitrine-13', label: 'Lula 13' },
  { href: '#vitrine-22', label: 'Bolsonaro 22' },
  { href: '#detalhes', label: 'Detalhes' },
  { href: '#duvidas', label: 'Dúvidas' },
]

export function Header() {
  const { config } = useShop()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const storeName = config.store.name

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <PreviewBanner />
      <PromoBar />
      <ServiceBar />
      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href="#">
            <Wordmark />
            <span className={storeName ? 'brand__name' : 'visually-hidden'}>{storeName ?? 'Bonés e camisas 13 e 22'}</span>
            <span className="visually-hidden"> — voltar ao início</span>
          </a>

          <nav className="site-nav" aria-label="Principal">
            <button
              ref={buttonRef}
              type="button"
              className="site-nav__toggle"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
            >
              Menu
            </button>
            <ul id={menuId} className="site-nav__list" data-open={open}>
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a className="btn btn--ink btn--small" href="#comprar">
            Comprar
          </a>
        </div>
      </header>
    </>
  )
}
