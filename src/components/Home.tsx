import type { ProductId } from '../config/types'
import { formatBRL, scrollToAndFocus, whatsappUrl } from '../lib/format'
import { discountFromCompareAt } from '../lib/purchase'
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
        <a className="service-bar__track" href="#faq-rastreio">
          <Icon name="send" size={16} />
          Rastreie seu pedido
        </a>
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

/** Duas fotos (uma de cada lado) e o texto de apresentação da loja. */
export function Intro() {
  const { config } = useShop()
  const { products, commerce } = config
  const pick = (id: ProductId, modelId: string) => products[id].models.find((m) => m.id === modelId)?.images[0]
  const photos = [pick('13', 'nome-lula-estrela'), pick('22', 'flavio')].filter((i) => i?.src)
  const min = commerce.freeShippingAboveCents

  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="container intro__grid">
        <div className="intro__photos">
          {photos.map((img) => (
            <ProductImageView key={img!.src} image={img!} frame="4 / 5" showBadge={false} sizes="(min-width: 900px) 280px, 45vw" />
          ))}
        </div>
        <div className="intro__text">
          <h2 id="intro-title" className="intro__title">
            Bonés e camisas 13 e 22
          </h2>
          <p>
            Modelos do Lula 13 e do Bolsonaro 22: bonés trucker, lisos e camuflados e camisas de algodão em várias cores.
            {commerce.payments && ` ${commerce.payments.join(' ou ')}.`}
            {min !== null && ` Frete grátis para ${commerce.freeShippingRegion ?? 'todo o Brasil'} acima de ${formatBRL(min)}.`}
          </p>
          <a className="btn btn--outline" href="#vitrine-13">
            Ver todos os produtos
          </a>
        </div>
      </div>
    </section>
  )
}

/** Vitrine de um lado: todos os modelos com foto, preço e botão Comprar. */
export function Showcase({ side }: { side: ProductId }) {
  const { config, selectModel } = useShop()
  const product = config.products[side]
  if (product.models.length === 0) return null

  const buy = (modelId: string) => {
    selectModel(modelId, side)
    // Espera a troca de modelo renderizar antes de rolar até a compra.
    setTimeout(() => scrollToAndFocus('comprar'), 0)
  }

  return (
    <section className="showcase" id={`vitrine-${side}`} data-accent={side} aria-labelledby={`vitrine-${side}-title`}>
      <div className="container">
        <header className="showcase__head">
          <h2 id={`vitrine-${side}-title`} className="showcase__title">
            <span className="showcase__num" aria-hidden="true">
              {product.number}
            </span>
            {product.name}
          </h2>
          <p className="showcase__count">
            {product.models.length} {product.models.length === 1 ? 'produto' : 'produtos'}
          </p>
        </header>
        <ul className="showcase__grid">
          {product.models.map((m) => {
            const img = m.images.find((i) => i.src)
            const off = discountFromCompareAt(m)
            const name = m.category === 'camisa' ? m.name : `Boné ${m.name}`
            return (
              <li key={m.id} className="pcard">
                <div className="pcard__img">
                  {img && <ProductImageView image={img} frame="1 / 1" showBadge={false} sizes="(min-width: 1100px) 280px, (min-width: 700px) 30vw, 45vw" />}
                  {off && <span className="pcard__off">-{off.percent}%</span>}
                </div>
                <h3 className="pcard__name">{name}</h3>
                <p className="pcard__price">
                  {off && (
                    <s>
                      <span className="visually-hidden">Preço anterior: </span>
                      {formatBRL(off.wasCents)}
                    </s>
                  )}
                  <strong>{m.priceCents === null ? 'Preço a confirmar' : formatBRL(m.priceCents)}</strong>
                </p>
                <button type="button" className="btn btn--outline pcard__btn" onClick={() => buy(m.id)}>
                  Comprar<span className="visually-hidden"> {name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
