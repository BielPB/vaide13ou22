import type { ReactNode } from 'react'
import { formatBRL, whatsappUrl } from '../lib/format'
import { useShop } from '../lib/shop'
import { Pending, useShowPending } from './Pending'
import { ContactLinks } from './ContactLinks'

interface Faq {
  q: string
  /** `null` quando a resposta depende de dado ainda não confirmado. */
  a: ReactNode | null
  field: string
  /** Âncora para links diretos (abre o item). */
  id?: string
}

export function FAQ() {
  const { config } = useShop()
  const showPending = useShowPending()
  const { commerce, contact, products } = config
  const allModels = [products['13'], products['22']].flatMap((p) => p.models.map((m) => ({ p, m })))
  const hasMeasures = allModels.some(({ m }) => m.specs.measurements)
  const closures = allModels.filter(({ m }) => m.specs.closure)

  const items: Faq[] = [
    {
      q: 'Como escolher entre os dois modelos?',
      field: '—',
      a: (
        <p>
          Os dois estão lado a lado em <a href="#detalhes">Detalhes</a>, com fotos de frente, lateral, parte traseira e
          acabamento, além de material e medidas. Compare, escolha em <a href="#modelos">Modelos</a> e troque de modelo
          quando quiser antes de finalizar.
        </p>
      ),
    },
    {
      q: 'Quais são as medidas e como funciona o ajuste?',
      field: 'MEDIDAS / FECHAMENTO',
      a:
        closures.length > 0 ? (
          <>
            {hasMeasures && (
              <p>
                As medidas de cada modelo estão na ficha técnica, em <a href="#detalhes">Sobre o produto</a>.
              </p>
            )}
            <ul>
              {closures.map(({ p, m }) => (
                <li key={`${p.id}-${m.id}`}>
                  {p.name} · {m.name}: {m.specs.closure}
                </li>
              ))}
            </ul>
            {commerce.fitGuide && <p>{commerce.fitGuide}</p>}
          </>
        ) : null,
    },
    {
      q: 'O produto recebido corresponde às fotos?',
      field: 'FOTOS_REAIS',
      a:
        commerce.photosMatchProduct === true ? (
          <p>Sim. As fotos desta página são do produto vendido, sem alteração de cor.</p>
        ) : null,
    },
    {
      q: 'Como consulto frete e prazo de entrega?',
      field: 'CONDICOES_DE_FRETE',
      a: (
        <>
          <p>
            Frete e prazo são calculados no checkout com o seu CEP e aparecem antes do pagamento. Esta página não faz
            estimativas.
          </p>
          {commerce.freeShippingAboveCents !== null && (
            <p>
              Compras acima de {formatBRL(commerce.freeShippingAboveCents)} têm frete grátis
              {commerce.freeShippingRegion ? ` para ${commerce.freeShippingRegion}` : ''}.
            </p>
          )}
          {commerce.shipping && <p>{commerce.shipping}</p>}
          {commerce.dispatchTime && <p>{commerce.dispatchTime}</p>}
        </>
      ),
    },
    {
      q: 'Quais formas de pagamento estão disponíveis?',
      field: 'PAGAMENTOS',
      a: commerce.payments ? <p>{commerce.payments.join(', ')}.</p> : null,
    },
    {
      q: 'Como funciona a troca ou devolução?',
      field: 'POLITICAS',
      a: commerce.returns ? (
        <p>
          {commerce.returns} <a href="#politica-trocas">Ver política completa</a>.
        </p>
      ) : null,
    },
    {
      q: 'Como acompanho meu pedido?',
      field: 'POLITICAS (rastreio)',
      id: 'faq-rastreio',
      a: commerce.tracking ? <p>{commerce.tracking}</p> : null,
    },
    {
      q: 'Como falo com a loja?',
      field: 'CONTATO',
      a:
        contact.whatsapp || contact.phone || contact.email || contact.instagram ? (
          <>
            <ContactLinks />
            {contact.hours && <p>{contact.hours}</p>}
          </>
        ) : null,
    },
  ]

  const visible = items.filter((i) => i.a !== null || showPending)

  return (
    <section className="section section--faq" id="duvidas" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <header className="section__head faq-grid__head">
          <p className="section__eyebrow">Dúvidas</p>
          <h2 id="faq-title" className="section__title">
            Ficou alguma dúvida?
          </h2>
          <p className="faq-grid__lead">As respostas rápidas estão aqui. Se ainda restar dúvida, é só chamar.</p>
          {config.contact.whatsapp && (
            <a className="btn btn--ink faq-grid__cta" href={whatsappUrl(config.contact.whatsapp)} target="_blank" rel="noopener">
              Falar no WhatsApp
            </a>
          )}
        </header>
        <div className="faq">
          {visible.map((item) => (
            <details key={item.q} id={item.id} className="faq__item">
              <summary className="faq__q">{item.q}</summary>
              <div className="faq__a">
                {item.a ?? (
                  <p>
                    <Pending field={item.field}>resposta depende deste dado</Pending>
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
