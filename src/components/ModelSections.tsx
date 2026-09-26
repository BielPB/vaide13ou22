import type { ReactNode } from 'react'
import { formatBRL, scrollToAndFocus } from '../lib/format'
import { discountFromCompareAt } from '../lib/purchase'
import { useShop } from '../lib/shop'
import { Pending, useShowPending } from './Pending'
import { ProductImageView } from './ProductImageView'

/** "Por que escolher": cartões numerados a partir dos destaques confirmados do modelo. */
export function Highlights() {
  const { selection } = useShop()
  const model = selection?.model
  if (!model || model.specs.highlights.length === 0) return null
  return (
    <section className="section section--highlights" aria-labelledby="hl-title" data-accent={selection.product.id}>
      <div className="container">
        <header className="section__head section__head--center">
          <p className="section__eyebrow">Por que escolher</p>
          <h2 id="hl-title" className="section__title">
            {model.name}
          </h2>
        </header>
        <ol className="hl">
          {model.specs.highlights.map((h, i) => (
            <li key={h} className="hl__item">
              <span className="hl__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p>{h}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function SpecItem({ n, title, value, field }: { n: number; title: string; value: ReactNode | null; field: string }) {
  const showPending = useShowPending()
  if (value === null && !showPending) return null
  return (
    <li className="spec">
      <span className="spec__num" aria-hidden="true">
        {String(n).padStart(2, '0')}
      </span>
      <div>
        <h3 className="spec__title">{title}</h3>
        <div className="spec__value">{value ?? <Pending field={field}>a confirmar</Pending>}</div>
      </div>
    </li>
  )
}

/** Ficha técnica do modelo selecionado. */
export function Specs() {
  const { selection } = useShop()
  const model = selection?.model
  if (!selection || !model) return null
  const { specs } = model
  const id = selection.product.id
  let n = 0
  return (
    <section className="section section--specs" id="detalhes" aria-labelledby="specs-title">
      <div className="container container--narrow">
        <header className="section__head section__head--center">
          <p className="section__eyebrow">Ficha técnica</p>
          <h2 id="specs-title" className="section__title">
            Detalhes do {model.name}
          </h2>
        </header>
        <ol className="specs-list">
          <SpecItem n={++n} title="Cores disponíveis" field={`VARIANTES_${id}`} value={[...new Set(model.variants.map((v) => v.label))].join(', ') || null} />
          <SpecItem n={++n} title="Material" field={`MATERIAL_${id}`} value={specs.material} />
          {model.category !== 'camisa' && (
            <SpecItem n={++n} title="Fechamento" field={`FECHAMENTO_${id}`} value={specs.closure} />
          )}
          {model.category === 'camisa' && (
            <SpecItem n={++n} title="Tamanhos" field={`VARIANTES_${id}`} value={[...new Set(model.variants.map((v) => v.size))].join(', ') || null} />
          )}
          <SpecItem
            n={++n}
            title={model.category === 'camisa' ? 'Tabela de medidas' : 'Medidas'}
            field={`MEDIDAS_${id}`}
            value={
              specs.measurements &&
              (model.category === 'camisa' ? (
                <>
                  <table className="size-table">
                    <thead>
                      <tr>
                        <th scope="col">Tamanho</th>
                        <th scope="col">Largura</th>
                        <th scope="col">Comprimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {specs.measurements.map(([size, v]) => {
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
                  {specs.measurementsNote && <p className="size-table__note">{specs.measurementsNote}</p>}
                </>
              ) : (
                specs.measurements.map(([k, v]) => `${k}: ${v}`).join(' · ')
              ))
            }
          />
          <SpecItem n={++n} title="Cuidados" field={`CUIDADOS_${id}`} value={specs.care} />
        </ol>
      </div>
    </section>
  )
}

/** Todos os modelos dos dois lados, para trocar sem voltar ao topo. */
export function ModelGrid() {
  const { config, selection, selectModel } = useShop()
  const showPending = useShowPending()
  const sides = (['13', '22'] as const).map((id) => config.products[id])

  return (
    <section className="section section--models" id="modelos" aria-labelledby="models-title">
      <div className="container">
        <header className="section__head section__head--center">
          <p className="section__eyebrow">Modelos</p>
          <h2 id="models-title" className="section__title">
            13 ou 22: todos os modelos
          </h2>
        </header>
        {sides.map((p) =>
          p.models.length === 0 ? (
            showPending && (
              <div key={p.id} className="mg-side" data-accent={p.id}>
                <h3 className="mg-side__title">
                  <span className="mg-side__num">{p.number}</span> {p.name}
                </h3>
                <p className="mg-side__empty">
                  Nenhum modelo cadastrado. <Pending field={`VARIANTES_${p.id}`}>modelos, fotos e preços</Pending>
                </p>
              </div>
            )
          ) : (
            <div key={p.id} className="mg-side" data-accent={p.id}>
              <h3 className="mg-side__title">
                <span className="mg-side__num">{p.number}</span> {p.name}
              </h3>
              <ul className="mg">
                {p.models.map((m) => {
                  const img = m.images.find((i) => i.src)
                  const current = selection?.product.id === p.id && selection.model?.id === m.id
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        className="mg__card"
                        aria-current={current}
                        onClick={() => {
                          selectModel(m.id, p.id)
                          scrollToAndFocus('comprar')
                        }}
                      >
                        {img && <ProductImageView image={img} frame="1 / 1" showBadge={false} sizes="(min-width: 900px) 22vw, 45vw" />}
                        <span className="mg__name">{m.name}</span>
                        <span className="mg__price">
                          {discountFromCompareAt(m) && (
                            <s className="mg__was">
                              <span className="visually-hidden">Preço anterior: </span>
                              {formatBRL(m.compareAtCents!)}
                            </s>
                          )}
                          {m.priceCents === null ? 'Preço a confirmar' : formatBRL(m.priceCents)}
                        </span>
                        {m.priceCents !== null && m.tiers[0] && (
                          <span className="mg__tier">
                            {m.tiers[0].minQuantity}+ por {formatBRL(m.tiers[0].priceCents)} cada
                          </span>
                        )}
                        <span className="mg__cta">{current ? 'Selecionado' : 'Ver modelo'}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ),
        )}
      </div>
    </section>
  )
}

/** Garantias reais: direito de arrependimento (lei), troca por defeito, atendimento, frete grátis. */
export function Guarantee() {
  const { config } = useShop()
  const { commerce, contact } = config
  const items: Array<{ title: string; text: ReactNode }> = [
    {
      title: '7 dias para desistir',
      text: 'Comprou e mudou de ideia? Você pode desistir em até 7 dias após receber, como garante o Código de Defesa do Consumidor (art. 49).',
    },
    {
      title: 'Troca por defeito',
      text: (
        <>
          Produto com defeito de fabricação é trocado. <a href="#politica-trocas">Ver política de trocas</a>
        </>
      ),
    },
    ...(commerce.freeShippingAboveCents !== null
      ? [
          {
            title: 'Frete grátis',
            text: `Em compras acima de ${formatBRL(commerce.freeShippingAboveCents)}${
              commerce.freeShippingRegion ? ` para ${commerce.freeShippingRegion}` : ''
            }. Abaixo disso, o frete é calculado com o seu CEP no checkout.`,
          },
        ]
      : []),
    ...(contact.whatsapp
      ? [{ title: 'Atendimento no WhatsApp', text: `Dúvida antes ou depois da compra? Fale com a loja pelo ${contact.phone ?? 'WhatsApp'}.` }]
      : []),
  ]
  return (
    <section className="section section--guarantee" aria-labelledby="guarantee-title">
      <div className="container">
        <header className="section__head section__head--center">
          <p className="section__eyebrow">Compra tranquila</p>
          <h2 id="guarantee-title" className="section__title">
            Seu pedido com garantia
          </h2>
        </header>
        <ul className="guarantee">
          {items.map((i) => (
            <li key={i.title} className="guarantee__item">
              <h3>{i.title}</h3>
              <p>{i.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
