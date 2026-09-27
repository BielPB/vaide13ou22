import type { ProductId, Review } from '../config/types'
import { formatBRL, whatsappUrl } from '../lib/format'
import { discountFromCompareAt } from '../lib/purchase'
import { Link } from '../lib/router'
import { modelFullName, productPath } from '../lib/routes'
import { useShop } from '../lib/shop'
import { Icon } from './Icon'
import { ProductImageView } from './ProductImageView'

/** Faixa fina abaixo do frete grátis: atendimento à esquerda, rastreio dos Correios à direita. */
export function ServiceBar() {
  const { contact, commerce } = useShop().config
  if (!contact.whatsapp) return null
  return (
    <div className="service-bar">
      <div className="container service-bar__inner">
        <p className="service-bar__contact">
          <span className="service-bar__label">Atendimento:</span>
          <a href={whatsappUrl(contact.whatsapp)} target="_blank" rel="noopener">
            <Icon name="chat" size={16} />
            <span className="visually-hidden">WhatsApp </span>
            {contact.phone}
          </a>
        </p>
        {commerce.trackingUrl && (
          <a className="service-bar__track" href={commerce.trackingUrl} target="_blank" rel="noopener">
            <Icon name="send" size={16} />
            Rastreie seu pedido
            <span className="visually-hidden"> no site dos Correios (abre em nova aba)</span>
          </a>
        )}
      </div>
    </div>
  )
}

/** Banner largo do topo; no celular usa a arte mais alta, se houver. */
export function HeroBanner() {
  const banner = useShop().config.banner
  if (!banner) return null
  return (
    <section className="banner" aria-label="Destaque">
      <a className="banner__link" href="#vitrine-13">
        <picture>
          {banner.mobileSrc && (
            <source media="(max-width: 699px)" srcSet={banner.mobileSrc} width={banner.mobileWidth} height={banner.mobileHeight} />
          )}
          <img
            className="banner__img"
            src={banner.src}
            width={banner.width}
            height={banner.height}
            alt={banner.alt}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </a>
    </section>
  )
}

/** Duas fotos (uma de cada lado, cada uma leva ao produto) e o texto de apresentação da loja. */
export function Intro() {
  const { config } = useShop()
  const { products, commerce } = config
  const pick = (id: ProductId, modelId: string) => {
    const model = products[id].models.find((m) => m.id === modelId)
    const image = model?.images.find((img) => img.src)
    return model && image ? { href: productPath(products[id], model), name: modelFullName(model), image } : null
  }
  const photos = [pick('13', 'nome-lula-estrela'), pick('22', 'flavio')].filter((p) => p !== null)
  const min = commerce.freeShippingAboveCents

  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="container intro__grid">
        <div className="intro__photos">
          {photos.map((p) => (
            <Link key={p.href} href={p.href} className="intro__photo" aria-label={p.name}>
              <ProductImageView image={p.image} frame="4 / 5" showBadge={false} sizes="(min-width: 900px) 280px, 45vw" />
            </Link>
          ))}
        </div>
        <div className="intro__text">
          <h1 id="intro-title" className="intro__title">
            Bonés e camisas 13 e 22
          </h1>
          <p>
            Bonés trucker, lisos e camuflados e camisas de algodão, com fotos do produto real.
            {commerce.paymentsShort && ` Pagamento ${commerce.paymentsShort.charAt(0).toLowerCase()}${commerce.paymentsShort.slice(1)}.`}
            {min !== null && ` Frete grátis para ${commerce.freeShippingRegion ?? 'todo o Brasil'} acima de ${formatBRL(min)}.`}
          </p>
          <a className="btn btn--outline" href="#vitrine-13">
            Ver produtos
          </a>
        </div>
      </div>
    </section>
  )
}

/** Avaliações verificadas de um modelo (para a contagem nos cartões). */
const reviewCount = (reviews: Review[], productId: ProductId, modelId: string) =>
  reviews.filter((r) => r.verified && r.productId === productId && r.modelId === modelId).length

/**
 * Faixa de fotos enviadas por clientes nas avaliações, alternando os dois lados.
 * Cada foto leva à página do produto. Foto repetida (ex.: Boné Simples, que tem
 * as mesmas avaliações nos dois lados) aparece uma vez só.
 */
export function CustomerPhotos() {
  const { config } = useShop()
  const MAX = 12
  /** Fotos de um lado, revezando os modelos (a mais útil de cada modelo primeiro). */
  const fila = (side: ProductId) => {
    const porModelo = new Map<string, Review[]>()
    for (const r of config.reviews) {
      if (!r.verified || !r.photo || r.productId !== side) continue
      porModelo.set(r.modelId, [...(porModelo.get(r.modelId) ?? []), r])
    }
    const grupos = [...porModelo.values()].map((g) => g.sort((x, y) => (y.helpful ?? 0) - (x.helpful ?? 0)))
    const out: Review[] = []
    for (let i = 0; grupos.some((g) => i < g.length); i++) {
      for (const g of grupos) {
        const r = g[i]
        if (r) out.push(r)
      }
    }
    return out
  }
  const filas = [fila('13'), fila('22')]
  const vistas = new Set<string>()
  const itens: Array<{ review: Review; href: string; name: string }> = []
  // Alterna 13 e 22; foto já usada (ex.: Boné Simples nos dois lados) passa a vez para a próxima do mesmo lado.
  for (let lado = 0; itens.length < MAX && filas.some((f) => f.length); lado = 1 - lado) {
    let r = filas[lado]!.shift()
    while (r && vistas.has(r.photo!)) r = filas[lado]!.shift()
    if (!r) continue
    const product = config.products[r.productId]
    const model = product.models.find((m) => m.id === r!.modelId)
    if (!model) continue
    vistas.add(r.photo!)
    itens.push({ review: r, href: productPath(product, model), name: modelFullName(model) })
  }
  if (itens.length === 0) return null

  return (
    <section className="cphotos" aria-labelledby="cphotos-title">
      <div className="container">
        <header className="cphotos__head">
          <h2 id="cphotos-title" className="cphotos__title">
            Fotos de clientes
          </h2>
          <p className="cphotos__lead">Pedidos que já chegaram. Toque na foto para ver o produto.</p>
        </header>
        <ul className="cphotos__track">
          {itens.map(({ review, href, name }) => (
            <li key={review.photo}>
              <Link href={href} className="cphoto">
                <img className="cphoto__img" src={review.photo} alt={`Foto de cliente: ${name}`} loading="lazy" width={300} height={400} />
                <span className="cphoto__name">{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * Vitrine de um lado: cada cartão leva à página do produto.
 * Com `exclude`, vira a seção "mais modelos" da página de produto.
 */
export function Showcase({ side, exclude, title }: { side: ProductId; exclude?: string; title?: string }) {
  const { config } = useShop()
  const product = config.products[side]
  const models = product.models.filter((m) => m.id !== exclude)
  if (models.length === 0) return null
  const headingId = exclude ? 'mais-modelos-title' : `vitrine-${side}-title`

  return (
    <section className="showcase" id={exclude ? 'mais-modelos' : `vitrine-${side}`} data-accent={side} aria-labelledby={headingId}>
      <div className="container">
        <header className="showcase__head">
          <h2 id={headingId} className="showcase__title">
            <span className="showcase__num" aria-hidden="true">
              {product.number}
            </span>
            {title ?? product.name}
          </h2>
          {!exclude && (
            <p className="showcase__count">
              {models.length} {models.length === 1 ? 'produto' : 'produtos'}
            </p>
          )}
        </header>
        <ul className="showcase__grid">
          {models.map((m) => {
            const img = m.images.find((i) => i.src)
            const off = discountFromCompareAt(m)
            return (
              <li key={m.id} className="pcard">
                <Link href={productPath(product, m)} className="pcard__link">
                  <span className="pcard__img">
                    {img && <ProductImageView image={img} frame="1 / 1" showBadge={false} sizes="(min-width: 1100px) 280px, (min-width: 700px) 30vw, 45vw" />}
                    {off && <span className="pcard__off">-{off.percent}%</span>}
                  </span>
                  <h3 className="pcard__name">{modelFullName(m)}</h3>
                  {reviewCount(config.reviews, product.id, m.id) > 0 && (
                    <span className="pcard__reviews">{reviewCount(config.reviews, product.id, m.id)} avaliações</span>
                  )}
                  <span className="pcard__price">
                    {off && (
                      <s>
                        <span className="visually-hidden">Preço anterior: </span>
                        {formatBRL(off.wasCents)}
                      </s>
                    )}
                    <strong>{m.priceCents === null ? 'Preço a confirmar' : formatBRL(m.priceCents)}</strong>
                  </span>
                  <span className="btn btn--checkout pcard__btn" aria-hidden="true">
                    Comprar
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
