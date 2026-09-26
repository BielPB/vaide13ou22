import { useEffect, useId, useState, type ReactNode } from 'react'
import type { ProductId, ProductModel, ProductVariant } from '../config/types'
import { formatBRL } from '../lib/format'
import { blockMessages, checkoutProviderName, discountFromCompareAt, isVariantInStock, lowestPriceCents } from '../lib/purchase'
import { useShop } from '../lib/shop'
import { BuyButton } from './BuyButton'
import { Icon } from './Icon'
import { Pending, useShowPending } from './Pending'
import { ProductGallery } from './ProductGallery'
import { ProductImageView } from './ProductImageView'
import { ReviewStars, useReviewSummary } from './Reviews'

/** "Preta · M" para camisas; só a cor para bonés. */
export const variantName = (v: ProductVariant) => (v.size ? `${v.label} · ${v.size}` : v.label)

const hasSizes = (m: ProductModel) => m.variants.some((v) => v.size)

/** Rádio nativo escondido dentro de um rótulo estilizado: setas, Tab e leitores de tela funcionam. */
function Choice({
  name,
  value,
  checked,
  disabled = false,
  onChange,
  className,
  children,
}: {
  name: string
  value: string
  checked: boolean
  disabled?: boolean
  onChange: () => void
  className: string
  children: ReactNode
}) {
  return (
    <label className={className} data-selected={checked} data-disabled={disabled}>
      <input className="choice__input" type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} />
      {children}
    </label>
  )
}

/** Abas grandes 13 | 22 no topo: a assinatura da loja e o jeito de trocar de lado. */
function SideTabs() {
  const { config, selectedId, selectProduct } = useShop()
  const showPending = useShowPending()
  return (
    <fieldset className="sides">
      <legend className="sides__legend">13 ou 22 — qual vai na sua cabeça?</legend>
      <div className="sides__row">
        {(['13', '22'] as ProductId[]).map((id) => {
          const p = config.products[id]
          const from = lowestPriceCents(p)
          if (p.models.length === 0 && !showPending) return null
          return (
            <Choice
              key={id}
              name="lado"
              value={id}
              checked={selectedId === id}
              onChange={() => selectProduct(id)}
              className={`side side--${id}`}
            >
              <span className="side__num" aria-hidden="true">
                {p.number}
              </span>
              <span className="side__text">
                <span className="side__name">{p.name}</span>
                <span className="side__meta">
                  {p.models.length} {p.models.length === 1 ? 'modelo' : 'modelos'}
                  {from !== null && ` · a partir de ${formatBRL(from)}`}
                </span>
              </span>
            </Choice>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Faixa de modelos do lado escolhido, com foto grande. */
function ModelRail() {
  const { selection, selectModel } = useShop()
  if (!selection || selection.product.models.length === 0) return null
  const { product, model } = selection
  return (
    <fieldset className="rail" id="modelos">
      <legend className="rail__legend">
        Modelos <span className="rail__count">{product.models.length}</span>
      </legend>
      <div className="rail__track">
        {product.models.map((m) => {
          const img = m.images.find((i) => i.src)
          const off = discountFromCompareAt(m)
          return (
            <Choice
              key={m.id}
              name={`modelo-${product.id}`}
              value={m.id}
              checked={model?.id === m.id}
              onChange={() => selectModel(m.id)}
              className="rcard"
            >
              <span className="rcard__img">
                {img && <ProductImageView image={img} frame="1 / 1" showBadge={false} sizes="(min-width: 900px) 180px, 40vw" />}
                {off && <span className="rcard__off">-{off.percent}%</span>}
              </span>
              <span className="rcard__name">{m.name}</span>
              <span className="rcard__price">
                {off && (
                  <s>
                    <span className="visually-hidden">Preço anterior: </span>
                    {formatBRL(off.wasCents)}
                  </s>
                )}
                {m.priceCents === null ? 'Preço a confirmar' : formatBRL(m.priceCents)}
              </span>
            </Choice>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Amostras de cor (bonés): foto redonda + nome. */
function ColorSwatches({
  productId,
  model,
  current,
  onPick,
}: {
  productId: ProductId
  model: ProductModel
  current: string | null
  onPick: (label: string) => void
}) {
  const colors = [...new Map(model.variants.map((v) => [v.label, v])).values()]
  return (
    <fieldset className="pick">
      <legend className="pick__label">
        Cor: <span className="pick__chosen">{current ?? 'escolha uma cor'}</span>
      </legend>
      <div className="swatches">
        {colors.map((c) => {
          const img = model.images.find((i) => i.src === c.image)
          const inStock = model.variants.some((v) => v.label === c.label && isVariantInStock(v))
          return (
            <Choice
              key={c.label}
              name={`cor-${productId}-${model.id}`}
              value={hasSizes(model) ? c.label : c.id}
              checked={current === c.label}
              disabled={!inStock}
              onChange={() => onPick(c.label)}
              className="swatch"
            >
              <span className="swatch__img">
                {img ? <ProductImageView image={img} frame="1 / 1" showBadge={false} sizes="56px" /> : <span className="swatch__none" />}
              </span>
              <span className="swatch__label">
                {c.label}
                {!inStock && <span className="swatch__out"> · esgotado</span>}
              </span>
            </Choice>
          )
        })}
      </div>
    </fieldset>
  )
}

function SizePicker({
  productId,
  model,
  color,
  variant,
  onSelect,
}: {
  productId: ProductId
  model: ProductModel
  color: string | null
  variant: ProductVariant | null
  onSelect: (id: string) => void
}) {
  const options = color ? model.variants.filter((v) => v.label === color) : [...new Map(model.variants.map((v) => [v.size, v])).values()]
  return (
    <fieldset className="pick" disabled={!color}>
      <legend className="pick__label">
        Tamanho: <span className="pick__chosen">{variant?.size ?? (color ? 'escolha o tamanho' : 'escolha a cor primeiro')}</span>
        <a className="pick__help" href="#detalhes">
          Tabela de medidas
        </a>
      </legend>
      <div className="sizes">
        {options.map((v) => {
          const inStock = isVariantInStock(v)
          return (
            <Choice
              key={v.size}
              name={`tamanho-${productId}-${model.id}`}
              value={v.size!}
              checked={variant?.id === v.id}
              disabled={!color || !inStock}
              onChange={() => onSelect(v.id)}
              className="size"
            >
              {v.size}
            </Choice>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Progresso até o frete grátis (valor real configurado). */
function FreeShippingProgress({ subtotalCents }: { subtotalCents: number | null }) {
  const { commerce } = useShop().config
  const min = commerce.freeShippingAboveCents
  if (min === null || subtotalCents === null) return null
  const region = commerce.freeShippingRegion ? ` para ${commerce.freeShippingRegion}` : ''
  const done = subtotalCents > min
  return (
    <div className="ship" data-done={done}>
      <Icon name="truck" size={18} />
      <p className="ship__text">
        {done ? (
          <>
            <strong>Frete grátis{region}</strong> neste pedido
          </>
        ) : (
          <>
            Faltam <strong>{formatBRL(min - subtotalCents + 1)}</strong> para <strong>frete grátis{region}</strong>
          </>
        )}
      </p>
      <span className="ship__bar" aria-hidden="true">
        <span style={{ width: `${Math.min(100, (subtotalCents / (min + 1)) * 100)}%` }} />
      </span>
    </div>
  )
}

export function ProductPage() {
  const { config, selection, checkout, selectVariant, setQuantity } = useShop()
  const qtyId = useId()
  const summary = useReviewSummary(selection?.product.id, selection?.model?.id)
  const [pendingColor, setPendingColor] = useState<string | null>(null)
  const modelKey = selection ? `${selection.product.id}/${selection.model?.id ?? ''}` : ''
  useEffect(() => setPendingColor(null), [modelKey])

  if (!selection) {
    return (
      <section className="store" aria-labelledby="pdp-title">
        <h1 id="pdp-title" className="visually-hidden">
          13 ou 22. Qual vai na sua cabeça?
        </h1>
        <SideTabs />
      </section>
    )
  }

  const { product, model, variant, quantity, rule, unitCents, subtotalCents, state } = selection
  const images = model?.images ?? [product.heroImage]
  const off = model ? discountFromCompareAt(model) : null
  const provider = checkoutProviderName(config)
  const sized = model ? hasSizes(model) : false
  const color = variant?.label ?? pendingColor

  const pickColor = (label: string) => {
    if (!model) return
    if (!sized) {
      const v = model.variants.find((x) => x.label === label)
      if (v) selectVariant(v.id)
      return
    }
    // Camisa: mantém o tamanho se existir na nova cor; nunca escolhe tamanho sozinho.
    const same = variant && model.variants.find((x) => x.label === label && x.size === variant.size && isVariantInStock(x))
    setPendingColor(label)
    selectVariant(same ? same.id : null)
  }

  const blockText =
    state.block === 'variant-not-chosen' && sized
      ? color
        ? 'Escolha o tamanho para continuar.'
        : 'Escolha a cor e o tamanho para continuar.'
      : state.block
        ? blockMessages[state.block]
        : null

  return (
    <section className="store" data-accent={product.id} aria-labelledby="pdp-title">
      <SideTabs />

      <div className="container">
        <ModelRail />

        <div className="pdp__grid" id="comprar" tabIndex={-1}>
          <div className="pdp__media">
            <ProductGallery
              key={modelKey}
              title={[product.name, model?.name].filter(Boolean).join(' · ')}
              images={images}
              focusSrc={variant?.image ?? model?.variants.find((v) => v.label === pendingColor)?.image}
              priority
            />
          </div>

          <div className="buybox">
            <p className="buybox__badge">
              {model?.category === 'camisa' ? 'Camisa' : 'Boné'} {product.number}
              {variant && ` · ${variantName(variant)}`}
            </p>
            <h1 id="pdp-title" className="buybox__title">
              {model ? model.name : product.name}
            </h1>
            {summary && (
              <a className="buybox__rating" href="#avaliacoes">
                <ReviewStars value={summary.average} /> {summary.average.toFixed(1).replace('.', ',')} ({summary.count}{' '}
                {summary.count === 1 ? 'avaliação' : 'avaliações'})
              </a>
            )}

            {model && (
              <div className="price-block" aria-live="polite">
                {unitCents === null ? (
                  <p className="price--pending">
                    Preço a confirmar <Pending field={`PRECO_BONE_${product.id}`} />
                  </p>
                ) : (
                  <p className="price-block__main">
                    <span className="price-block__value">{formatBRL(unitCents)}</span>
                    {off && (
                      <>
                        <s className="price-block__was">
                          <span className="visually-hidden">Preço anterior: </span>
                          {formatBRL(off.wasCents)}
                        </s>
                        <span className="price-block__off">{off.percent}% OFF</span>
                      </>
                    )}
                  </p>
                )}
                {config.commerce.payments && <p className="price-block__pay">{config.commerce.payments.join(' ou ')}</p>}
              </div>
            )}

            {model?.description && <p className="buybox__desc">{model.description}</p>}

            {model && model.variants.length > 0 && (
              <ColorSwatches productId={product.id} model={model} current={color} onPick={pickColor} />
            )}
            {model && sized && (
              <SizePicker productId={product.id} model={model} color={color} variant={variant} onSelect={selectVariant} />
            )}
            {product.models.length === 0 && (
              <p className="buybox__empty">
                Os modelos deste lado ainda não foram cadastrados. <Pending field={`VARIANTES_${product.id}`}>modelos, fotos e preços</Pending>
              </p>
            )}

            {model && (
              <div className="buyrow">
                {rule.fixed ? (
                  <p className="qty__static">
                    <output id={qtyId}>1</output> <span className="field__note">{rule.note}</span>
                  </p>
                ) : (
                  <div className="stepper" role="group" aria-labelledby={`${qtyId}-label`}>
                    <span id={`${qtyId}-label`} className="visually-hidden">
                      Quantidade
                    </span>
                    <button
                      type="button"
                      className="stepper__btn"
                      onClick={() => setQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                      aria-label="Diminuir quantidade"
                    >
                      −
                    </button>
                    <input
                      id={qtyId}
                      className="stepper__input"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={rule.max}
                      value={quantity}
                      aria-label="Quantidade"
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <button
                      type="button"
                      className="stepper__btn"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= rule.max}
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>
                )}
                <BuyButton
                  className="btn--large"
                  label={subtotalCents !== null && variant ? `Comprar · ${formatBRL(subtotalCents)}` : 'Comprar'}
                />
              </div>
            )}

            {blockText && (
              <p className="summary__block" id={`block-${product.id}`}>
                {blockText}
              </p>
            )}
            {checkout.kind === 'error' && (
              <p className="summary__error" role="alert">
                {checkout.message}
              </p>
            )}

            {model && <FreeShippingProgress subtotalCents={subtotalCents} />}

            <ul className="trust">
              <li>
                <Icon name="lock" size={18} />
                <span>
                  <strong>Compra 100% segura</strong>: pagamento {provider ? `no checkout da ${provider}` : 'em checkout externo'}, em
                  conexão criptografada
                </span>
              </li>
              <li>
                <Icon name="truck" size={18} />
                <span>{config.commerce.dispatchTime ?? 'Frete e prazo calculados pelo CEP antes de pagar.'}</span>
              </li>
              <li>
                <Icon name="refresh" size={18} />
                <span>7 dias para desistir ou trocar tamanho/cor após receber</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
