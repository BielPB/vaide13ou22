import type { ReactNode } from 'react'
import { formatBRL, whatsappUrl } from '../lib/format'
import { modelFullName } from '../lib/routes'
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

/** Perguntas na ordem da compra: produto, tamanho, pagamento, entrega, pós-venda. Respostas só com dados do store.ts. */
export function FAQ() {
  const { config } = useShop()
  const showPending = useShowPending()
  const { commerce, contact, products, store } = config
  const allModels = [products['13'], products['22']].flatMap((p) => p.models.map((m) => ({ p, m })))
  const caps = allModels.filter(({ m }) => m.category !== 'camisa')
  const capsWithFit = caps.filter(({ m }) => m.specs.closure)
  const shirtSpecs = allModels.find(({ m }) => m.category === 'camisa' && m.specs.measurements)?.m.specs
  const freeMin = commerce.freeShippingAboveCents
  const freeLine =
    freeMin !== null ? `Acima de ${formatBRL(freeMin)}, o frete é grátis${commerce.freeShippingRegion ? ` para ${commerce.freeShippingRegion}` : ''}.` : null

  const items: Faq[] = [
    {
      q: 'As fotos mostram o produto que vou receber?',
      field: 'FOTOS_REAIS',
      a:
        commerce.photosMatchProduct === true ? (
          <p>Sim. As fotos são do produto vendido, sem retoque de cor. O tom pode variar um pouco de uma tela para outra.</p>
        ) : null,
    },
    {
      q: 'Qual é o tamanho dos bonés?',
      field: 'MEDIDAS / FECHAMENTO',
      a:
        capsWithFit.length > 0 ? (
          <>
            <ul>
              {capsWithFit.map(({ p, m }) => {
                const size = m.specs.measurements?.find(([k]) => k === 'Tamanho')?.[1]
                const closure = m.specs.closure!
                return (
                  <li key={`${p.id}-${m.id}`}>
                    <strong>{modelFullName(m)}</strong> ({p.number}): {size ? `tamanho ${size.split(',')[0]!.toLowerCase()}, com ` : ''}
                    {closure.charAt(0).toLowerCase() + closure.slice(1)}.
                  </li>
                )
              })}
            </ul>
            {capsWithFit.length < caps.length && <p>Para os outros modelos, chame no WhatsApp que confirmamos o ajuste.</p>}
          </>
        ) : null,
    },
    {
      q: 'Como escolho o tamanho da camisa?',
      field: 'MEDIDAS (camisas)',
      a: shirtSpecs?.measurements ? (
        <>
          <p>As camisas vêm em P, M, G e GG, com modelagem unissex. Medidas com a peça esticada:</p>
          <table className="size-table">
            <thead>
              <tr>
                <th scope="col">Tamanho</th>
                <th scope="col">Largura</th>
                <th scope="col">Comprimento</th>
              </tr>
            </thead>
            <tbody>
              {shirtSpecs.measurements.map(([size, v]) => {
                const [w, l] = v.split(' · ').map((x) => x.replace(/^(Largura|Comprimento) /, ''))
                return (
                  <tr key={size}>
                    <th scope="row">{size}</th>
                    <td>{w}</td>
                    <td>{l}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p>Podem variar até 2 cm. Dica: meça uma camiseta sua que veste bem e compare.</p>
        </>
      ) : null,
    },
    {
      q: 'Quais são as formas de pagamento?',
      field: 'PAGAMENTOS',
      a: commerce.payments ? <p>Pix ou cartão de crédito em até 12x, no checkout seguro.</p> : null,
    },
    {
      q: 'Tem desconto comprando mais de uma peça?',
      field: '—',
      a: commerce.quantityDiscountActive ? null : <p>No momento, não. {freeLine}</p>,
    },
    {
      q: 'O preço riscado é real?',
      field: '—',
      a: allModels.some(({ m }) => m.compareAtCents) ? (
        <p>Sim. É o preço que já cobramos por aquele modelo. Só mostramos preço riscado quando ele existiu de verdade.</p>
      ) : null,
    },
    {
      q: 'Quanto custa o frete e em quanto tempo chega?',
      field: 'CONDICOES_DE_FRETE',
      a: (
        <p>
          O valor e o prazo aparecem no checkout, calculados pelo seu CEP, antes de você pagar. {freeLine} {commerce.dispatchTime}
        </p>
      ),
    },
    {
      q: 'Como acompanho meu pedido?',
      field: 'POLITICAS (rastreio)',
      id: 'faq-rastreio',
      a: commerce.tracking ? (
        <p>
          {commerce.tracking}
          {commerce.trackingUrl && (
            <>
              {' '}
              Com o código em mãos, acompanhe no{' '}
              <a href={commerce.trackingUrl} target="_blank" rel="noopener">
                site dos Correios
              </a>
              .
            </>
          )}
        </p>
      ) : null,
    },
    {
      q: 'Posso cancelar o pedido?',
      field: 'POLITICAS',
      a: contact.phone ? (
        <p>
          Sim. Antes da postagem, peça pelo WhatsApp {contact.phone} e devolvemos o valor integral. Depois da postagem, vale a
          política de trocas.
        </p>
      ) : null,
    },
    {
      q: 'Como funciona a troca ou a devolução?',
      field: 'POLITICAS',
      a: commerce.returns ? (
        <p>
          {commerce.returns} <a href="#politica-trocas">Ver política completa</a>
        </p>
      ) : null,
    },
    {
      q: 'A loja tem ligação com partidos ou candidatos?',
      field: 'IDENTIFICACAO_DO_VENDEDOR',
      a: store.independence.confirmed ? <p>{store.independence.statement.replace(/^Loja independente\. /, '')}</p> : null,
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
          <h2 id="faq-title" className="section__title">
            Perguntas frequentes
          </h2>
          <p className="faq-grid__lead">Não encontrou a resposta? Fale com a gente no WhatsApp.</p>
          {contact.whatsapp && (
            <a className="btn btn--outline faq-grid__cta" href={whatsappUrl(contact.whatsapp)} target="_blank" rel="noopener">
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
