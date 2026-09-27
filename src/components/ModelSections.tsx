import { Fragment, type ReactNode } from 'react'
import { formatBRL } from '../lib/format'
import { modelFullName } from '../lib/routes'
import { useShop } from '../lib/shop'
import { Icon, type IconName } from './Icon'
import { Pending, useShowPending } from './Pending'

/** Texto com **negrito** (vindo de src/config/descricoes.json) sem usar HTML cru. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <Fragment key={i}>{p}</Fragment>))}
    </>
  )
}

function SpecRow({ label, value, field }: { label: string; value: ReactNode | null; field: string }) {
  const showPending = useShowPending()
  if (value === null && !showPending) return null
  return (
    <div className="spec-row">
      <dt>{label}</dt>
      <dd>{value ?? <Pending field={field}>a confirmar</Pending>}</dd>
    </div>
  )
}

/** Descrição completa + ficha técnica do modelo selecionado. */
export function ProductInfo() {
  const { selection } = useShop()
  const model = selection?.model
  if (!selection || !model) return null
  const { specs, about } = model
  const id = selection.product.id
  const camisa = model.category === 'camisa'
  const sizes = [...new Set(model.variants.map((v) => v.size).filter(Boolean))].join(', ')
  // Linhas da ficha da descrição que não repetem os campos estruturados
  const extraFicha = (about?.ficha ?? []).filter(([k]) => !/^(tecido|material|fechamento|tamanhos?|cuidados|medidas)/i.test(k))

  return (
    <section className="section about" id="detalhes" aria-labelledby="about-title" data-accent={id}>
      <div className="container about__grid">
        <div className="about__text">
          <p className="section__eyebrow">Sobre o produto</p>
          <h2 id="about-title" className="section__title">
            {modelFullName(model)}
          </h2>
          {about ? (
            <>
              {about.abertura.map((p) => (
                <p key={p} className="about__lead">
                  <Rich text={p} />
                </p>
              ))}
              <ul className="about__list">
                {about.destaques.map((d) => (
                  <li key={d}>
                    <Rich text={d} />
                  </li>
                ))}
              </ul>
              <p className="about__when">
                <strong>Para usar:</strong> {about.quandoUsar}
              </p>
            </>
          ) : (
            model.description && <p className="about__lead">{model.description}</p>
          )}
        </div>

        <aside className="about__specs" aria-labelledby="specs-title">
          <h3 id="specs-title" className="about__specs-title">
            Ficha técnica
          </h3>
          <dl className="spec-list">
            <SpecRow label="Cores" field={`VARIANTES_${id}`} value={[...new Set(model.variants.map((v) => v.label))].join(', ') || null} />
            {camisa && <SpecRow label="Tamanhos" field={`VARIANTES_${id}`} value={sizes || null} />}
            <SpecRow label="Material" field={`MATERIAL_${id}`} value={specs.material} />
            {!camisa && <SpecRow label="Fechamento" field={`FECHAMENTO_${id}`} value={specs.closure} />}
            {!camisa && (
              <SpecRow
                label="Medidas"
                field={`MEDIDAS_${id}`}
                value={specs.measurements && specs.measurements.map(([k, v]) => `${k}: ${v}`).join(' · ')}
              />
            )}
            {extraFicha.map(([k, v]) => (
              <SpecRow key={k} label={k} field="—" value={v} />
            ))}
            <SpecRow label="Cuidados" field={`CUIDADOS_${id}`} value={specs.care} />
          </dl>

          {camisa && specs.measurements && (
            <div className="sizes-box">
              <h4 className="sizes-box__title">Tabela de medidas</h4>
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
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

/** Garantias reais em faixa escura: arrependimento (lei), troca por defeito, frete grátis, atendimento. */
export function Guarantee() {
  const { config } = useShop()
  const { commerce, contact } = config
  const items: Array<{ icon: IconName; title: string; text: ReactNode }> = [
    { icon: 'refresh', title: 'Troca em 7 dias', text: 'Não gostou? Devolva em até 7 dias após receber. O frete de volta é por nossa conta.' },
    {
      icon: 'shield',
      title: 'Garantia de 90 dias',
      text: (
        <>
          Contra defeito de fabricação. <a href="#politica-trocas">Ver política</a>
        </>
      ),
    },
    ...(commerce.freeShippingAboveCents !== null
      ? [
          {
            icon: 'truck' as const,
            title: 'Frete grátis',
            text: `Nas compras acima de ${formatBRL(commerce.freeShippingAboveCents)}${commerce.freeShippingRegion ? `, para ${commerce.freeShippingRegion}` : ''}.`,
          },
        ]
      : []),
    ...(contact.whatsapp
      ? [{ icon: 'chat' as const, title: 'Atendimento no WhatsApp', text: `Antes e depois da compra: ${contact.phone ?? ''}` }]
      : []),
  ]
  return (
    <section className="guarantee-band" aria-labelledby="guarantee-title">
      <div className="container">
        <h2 id="guarantee-title" className="visually-hidden">
          Garantias da compra
        </h2>
        <ul className="gband">
          {items.map((i) => (
            <li key={i.title} className="gband__item">
              <span className="gband__icon">
                <Icon name={i.icon} size={22} />
              </span>
              <span>
                <strong className="gband__title">{i.title}</strong>
                <span className="gband__text">{i.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
