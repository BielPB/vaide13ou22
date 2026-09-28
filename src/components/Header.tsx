import { useEffect, useMemo, useState } from 'react'
import { isExampleData } from '../config'
import { formatBRL } from '../lib/format'
import { allPending, hasEssential } from '../lib/pending'
import { useShop } from '../lib/shop'
import { Link } from '../lib/router'
import { ServiceBar } from './Home'
import { CartButton } from './Cart'
import { SideMark } from './Icon'

/** Logo da loja, a asa-delta (versões leves em /public; original em marca/logo-asa-delta.png). */
export function BrandLogo({ className = 'brand__logo' }: { className?: string }) {
  return (
    <img
      className={className}
      src="/logo-100.webp"
      srcSet="/logo-100.webp 100w, /logo-200.webp 200w, /logo-300.webp 300w"
      sizes="(min-width: 900px) 100px, 86px"
      width={100}
      height={35}
      alt=""
    />
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

type Page = 'home' | 'product' | 'other'

/**
 * Categorias: as vitrines ficam na página inicial. Na página de produto a barra
 * não aparece (o caminho de volta e "Mais modelos" já levam às vitrines).
 */
const linksFor = (page: Page): Array<{ id: string; href: string; label: string; side?: '13' | '22' }> =>
  page === 'product'
    ? []
    : [
        { id: 'vitrine-13', href: '/#vitrine-13', label: 'Lula 13', side: '13' },
        { id: 'vitrine-22', href: '/#vitrine-22', label: 'Bolsonaro 22', side: '22' },
        // As perguntas frequentes (e o atalho para elas) só existem na página inicial.
        ...(page === 'home' ? [{ id: 'duvidas', href: '#duvidas', label: 'Dúvidas' }] : []),
      ]

/** Seção da barra de categorias que está na tela agora (para o sublinhado). */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    if (els.length === 0 || typeof IntersectionObserver === 'undefined') return
    const visible = new Map<string, boolean>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting)
        setActive(ids.find((id) => visible.get(id)) ?? null)
      },
      // Conta como "na tela" a faixa logo abaixo do cabeçalho fixo.
      { rootMargin: '-30% 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

export function Header({ page }: { page: Page }) {
  const { config } = useShop()
  const storeName = config.store.name
  const links = useMemo(() => linksFor(page), [page])
  const ids = useMemo(() => links.map((l) => l.id), [links])
  const active = useActiveSection(ids)

  return (
    <>
      <PreviewBanner />
      <PromoBar />
      <ServiceBar />
      <header className={links.length ? 'site-header' : 'site-header site-header--sem-categorias'}>
        <div className="container site-header__inner">
          <Link className="brand" href="/">
            <BrandLogo />
            <span className={storeName ? 'brand__name' : 'visually-hidden'}>{storeName ?? 'Bonés e camisas 13 e 22'}</span>
            <span className="visually-hidden"> — voltar ao início</span>
          </Link>

          <CartButton />

          {links.length > 0 && (
            <nav className="catbar" aria-label="Categorias">
              <ul className="catbar__list">
                {links.map((l) => (
                  <li key={l.id}>
                    <Link
                      className="catbar__link"
                      href={l.href}
                      data-side={l.side}
                      aria-current={active === l.id ? 'location' : undefined}
                    >
                      {l.side && <SideMark side={l.side} />}
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
