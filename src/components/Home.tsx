import type { ProductId } from '../config/types'
import { formatBRL, whatsappUrl } from '../lib/format'
import { discountFromCompareAt } from '../lib/purchase'
import { Link } from '../lib/router'
import { modelFullName, productPath } from '../lib/routes'
import { useShop } from '../lib/shop'
import { Icon } from './Icon'
import { ProductImageView } from './ProductImageView'

/** Faixa fina abaixo do frete grátis: atendimento à esquerda, rastreio à direita. */
export function ServiceBar() {
  const { contact } = useShop().config
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
        <Link className="service-bar__track" href="/#faq-rastreio">
          <Icon name="send" size={16} />
          Rastreie seu pedido
        </Link>
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
