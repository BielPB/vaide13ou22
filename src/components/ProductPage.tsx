import { useEffect, useId, useState, type ReactNode } from 'react'
import type { ProductId, ProductModel, ProductVariant } from '../config/types'
import { formatBRL } from '../lib/format'
import { blockMessages, checkoutProviderName, discountFromCompareAt, isVariantInStock, lowestPriceCents } from '../lib/purchase'
import { useShop } from '../lib/shop'
import { Pending, useShowPending } from './Pending'
import { ProductGallery } from './ProductGallery'
import { ProductImageView } from './ProductImageView'
import { BuyButton } from './BuyButton'
import { ReviewStars, useReviewSummary } from './Reviews'

/** Opção clicável com miniatura (lado, modelo ou cor). Usa rádio nativo: setas e Tab funcionam. */
function Option({
  name,
  value,
  checked,
  disabled = false,
  onChange,
  thumb,
  children,
  className = '',
}: {
  name: string
  value: string
  checked: boolean
  disabled?: boolean
  onChange: () => void
  thumb?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`opt ${className}`} data-selected={checked} data-disabled={disabled}>
      <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} />
      {thumb && <span className="opt__thumb">{thumb}</span>}
      <span className="opt__text">{children}</span>
    </label>
  )
}

function SidePicker() {
  const { config, selectedId, selectProduct } = useShop()
  const showPending = useShowPending()
  return (
    <fieldset className="pick">
      <legend className="pick__label">13 ou 22 — qual vai na sua cabeça?</legend>
      <div className="pick__row pick__row--sides">
        {(['13', '22'] as ProductId[]).map((id) => {
          const p = config.products[id]
          const empty = p.models.length === 0
          const from = lowestPriceCents(p)
          if (empty && !showPending) return null
          return (
            <Option
              key={id}
              name="lado"
              value={id}
              checked={selectedId === id}
              onChange={() => selectProduct(id)}
              className={`opt--side opt--side-${id}`}
              thumb={<span className="opt__num">{p.number}</span>}
            >
              <span className="opt__name">{p.name}</span>
              <span className="opt__meta">
                {empty ? (
                  <Pending field={`VARIANTES_${id}`}>sem modelos</Pending>
                ) : (
                  <>
                    {p.models.length} {p.models.length === 1 ? 'modelo' : 'modelos'}
                    {from !== null && ` · a partir de ${formatBRL(from)}`}
                  </>
                )}
              </span>
            </Option>
          )
        })}
      </div>
    </fieldset>
  )
}

/** "Preta · M" para camisas; só a cor para bonés. */
export const variantName = (v: ProductVariant) => (v.size ? `${v.label} · ${v.size}` : v.label)

const hasSizes = (m: ProductModel) => m.variants.some((v) => v.size)

/**
 * Cor + tamanho (camisas). A cor escolhida sem tamanho fica "pendente" até o
 * cliente escolher o tamanho — nunca escolhemos um tamanho por ele.
 */
function ColorSizePicker({
  productId,
  model,
  variant,
  pendingColor,
  onPendingColor,
  onSelect,
}: {
  productId: ProductId
  model: ProductModel
  variant: ProductVariant | null
  pendingColor: string | null
  onPendingColor: (c: string | null) => void
  onSelect: (id: string | null) => void
}) {
  const colors = [...new Map(model.variants.map((v) => [v.label, v])).values()]
  const color = variant?.label ?? pendingColor
  const sizes = model.variants.filter((v) => v.label === color)

  const pickColor = (label: string) => {
    const same = variant && model.variants.find((v) => v.label === label && v.size === variant.size && isVariantInStock(v))
    onPendingColor(label)
    onSelect(same ? same.id : null)
  }

  return (
    <>
      <fieldset className="pick">
        <legend className="pick__label">
          Cor: <span className="pick__chosen">{color ?? 'escolha uma cor'}</span>
        </legend>
        <div className="pick__row pick__row--colors">
          {colors.map((c) => {
            const img = model.images.find((i) => i.src === c.image)
            const anyInStock = model.variants.some((v) => v.label === c.label && isVariantInStock(v))
            return (
              <Option
                key={c.label}
                name={`cor-${productId}-${model.id}`}
                value={c.label}
                checked={color === c.label}
                disabled={!anyInStock}
                onChange={() => pickColor(c.label)}
                thumb={img && <ProductImageView image={img} frame="1 / 1" showBadge={false} sizes="40px" />}
              >
                <span className="opt__name">{c.label}</span>
                {!anyInStock && <span className="opt__meta">Esgotado</span>}
              </Option>
            )
          })}
        </div>
      </fieldset>
      <fieldset className="pick" disabled={!color}>
        <legend className="pick__label">
          Tamanho:{' '}
          <span className="pick__chosen">{variant?.size ?? (color ? 'escolha o tamanho' : 'escolha a cor primeiro')}</span>
        </legend>
        <div className="pick__row pick__row--sizes">
          {(color ? sizes : [...new Map(model.variants.map((v) => [v.size, v])).values()]).map((v) => {
            const inStock = isVariantInStock(v)
            return (
              <Option
                key={v.size}
                name={`tamanho-${productId}-${model.id}`}
                value={v.size!}
                checked={variant?.id === v.id}
                disabled={!color || !inStock}
                onChange={() => onSelect(v.id)}
                className="opt--size"
              >
                <span className="opt__name">{v.size}</span>
                {color && !inStock && <span className="opt__meta">Esgotado</span>}
              </Option>
            )
          })}
        </div>
      </fieldset>
    </>
  )
}

/** Barra de progresso até o frete grátis (valor real configurado). */
function FreeShippingProgress({ subtotalCents }: { subtotalCents: number | null }) {
  const { commerce } = useShop().config
  const min = commerce.freeShippingAboveCents
  if (min === null || subtotalCents === null) return null
  const region = commerce.freeShippingRegion ? ` para ${commerce.freeShippingRegion}` : ''
  const done = subtotalCents > min
  return (
    <div className="ship" data-done={done}>
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
  const { config, selection, checkout, selectModel, selectVariant, setQuantity } = useShop()
  const qtyId = useId()
  const summary = useReviewSummary(selection?.product.id, selection?.model?.id)
  const [pendingColor, setPendingColor] = useState<string | null>(null)
  const modelKey = selection ? `${selection.product.id}/${selection.model?.id ?? ''}` : ''
  useEffect(() => setPendingColor(null), [modelKey])

  if (!selection) {
    return (
      <section className="pdp" id="comprar" aria-labelledby="pdp-title">
        <div className="container pdp__solo">
          <h1 id="pdp-title" className="pdp__title">
            13 ou 22. Qual vai na sua cabeça?
          </h1>
          <SidePicker />
        </div>
      </section>
    )
  }

  const { product, model, variant, quantity, rule, unitCents, subtotalCents, state } = selection
  const images = model?.images ?? [product.heroImage]
  const tierApplied = model && model.priceCents !== null && unitCents !== null && unitCents < model.priceCents
  const off = model ? discountFromCompareAt(model) : null
  const provider = checkoutProviderName(config)
  const buyLabel =
    subtotalCents !== null && model && variant ? `Comprar agora — ${formatBRL(subtotalCents)}` : 'Comprar agora'

  return (
    <section className="pdp" id="comprar" data-accent={product.id} aria-labelledby="pdp-title">
      <div className="container pdp__grid">
        <div className="pdp__media">
          <ProductGallery
            key={`${product.id}/${model?.id ?? ''}`}
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
            <span className="buybox__line">{product.name}</span>
          </h1>
          {summary && (
            <a className="buybox__rating" href="#avaliacoes">
              <ReviewStars value={summary.average} /> {summary.average.toFixed(1).replace('.', ',')} ({summary.count}{' '}
              {summary.count === 1 ? 'avaliação' : 'avaliações'})
            </a>
          )}
          {(model?.description ?? product.tagline) && <p className="buybox__desc">{model?.description ?? product.tagline}</p>}

          <SidePicker />

          {product.models.length > 0 && (
            <fieldset className="pick">
              <legend className="pick__label">Modelo:</legend>
              <div className="pick__row pick__row--models">
                {product.models.map((m) => {
                  const thumb = m.images.find((img) => img.src)
                  return (
                    <Option
                      key={m.id}
                      name={`modelo-${product.id}`}
                      value={m.id}
                      checked={model?.id === m.id}
                      onChange={() => selectModel(m.id)}
                      thumb={thumb && <ProductImageView image={thumb} frame="1 / 1" showBadge={false} sizes="48px" />}
                    >
                      <span className="opt__name">{m.name}</span>
                      <span className="opt__meta">{m.priceCents === null ? 'Preço a confirmar' : formatBRL(m.priceCents)}</span>
                    </Option>
                  )
                })}
              </div>
            </fieldset>
          )}

          {model && hasSizes(model) && (
            <ColorSizePicker
              productId={product.id}
              model={model}
              variant={variant}
              pendingColor={pendingColor}
              onPendingColor={setPendingColor}
              onSelect={selectVariant}
            />
          )}
          {model && model.variants.length > 0 && !hasSizes(model) && (
            <fieldset className="pick">
              <legend className="pick__label">
                Cor: <span className="pick__chosen">{variant?.label ?? 'escolha uma opção'}</span>
              </legend>
              <div className="pick__row pick__row--colors">
                {model.variants.map((v) => {
                  const img = model.images.find((i) => i.src === v.image)
                  const inStock = isVariantInStock(v)
                  return (
                    <Option
                      key={v.id}
                      name={`cor-${product.id}-${model.id}`}
                      value={v.id}
                      checked={variant?.id === v.id}
                      disabled={!inStock}
                      onChange={() => selectVariant(v.id)}
                      thumb={img && <ProductImageView image={img} frame="1 / 1" showBadge={false} sizes="40px" />}
                    >
                      <span className="opt__name">{v.label}</span>
                      {!inStock && <span className="opt__meta">Esgotado</span>}
                    </Option>
                  )
                })}
              </div>
            </fieldset>
          )}
          {product.models.length === 0 && (
            <p className="buybox__empty">
              Os modelos deste lado ainda não foram cadastrados. <Pending field={`VARIANTES_${product.id}`}>modelos, fotos e preços</Pending>
            </p>
          )}

          {model && (
            <div className="price-block" aria-live="polite">
              <p className="price-block__main">
                {unitCents === null ? (
                  <span className="price--pending">
                    Preço a confirmar <Pending field={`PRECO_BONE_${product.id}`} />
                  </span>
                ) : (
                  <>
                    {off && !tierApplied && (
                      <s className="price-block__was">
                        <span className="visually-hidden">Preço anterior: </span>
                        {formatBRL(off.wasCents)}
                      </s>
                    )}
                    <span className="price-block__value">{formatBRL(unitCents)}</span>
                    {tierApplied && <s className="price-block__was">{formatBRL(model.priceCents!)}</s>}
                    {off && !tierApplied && <span className="price-block__off">{off.percent}% OFF</span>}
                    <span className="price-block__unit">/ unidade</span>
                  </>
                )}
              </p>
              {model.priceCents !== null &&
                model.tiers.map((t) => (
                  <p key={t.minQuantity} className="price-block__tier" data-active={quantity >= t.minQuantity}>
                    {quantity >= t.minQuantity ? 'Preço aplicado: ' : 'Leve '}
                    {t.minQuantity} ou mais da mesma cor por <strong>{formatBRL(t.priceCents)}</strong> cada
                  </p>
                ))}
            </div>
          )}

          {model && (
            <div className="qty">
              <label className="qty__label" htmlFor={qtyId}>
                Quantidade
              </label>
              {rule.fixed ? (
                <p className="qty__static">
                  <output id={qtyId}>1</output> <span className="field__note">{rule.note}</span>
                </p>
              ) : (
                <div className="stepper">
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
              {quantity > 1 && subtotalCents !== null && (
                <p className="qty__subtotal">
                  Subtotal: <strong>{formatBRL(subtotalCents)}</strong>
                </p>
              )}
            </div>
          )}

          {model && <BuyButton className="btn--large" label={buyLabel} />}

          {state.block && state.block !== 'models-missing' && (
            <p className="summary__block" id={`block-${product.id}`}>
              {state.block === 'variant-not-chosen' && model && hasSizes(model)
                ? pendingColor
                  ? 'Escolha o tamanho para continuar.'
                  : 'Escolha a cor e o tamanho para continuar.'
                : blockMessages[state.block]}
            </p>
          )}
          {checkout.kind === 'error' && (
            <p className="summary__error" role="alert">
              {checkout.message}
            </p>
          )}

          {model && <FreeShippingProgress subtotalCents={subtotalCents} />}

          {config.commerce.payments && (
            <ul className="pay" aria-label="Formas de pagamento">
              {config.commerce.payments.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}

          <ul className="trust">
            <li>
              <span>
                <strong>Compra 100% segura</strong>: pagamento {provider ? `no checkout da ${provider}` : 'em checkout externo'}, em
                conexão criptografada. Esta página não pede dados de cartão.
              </span>
            </li>
            <li>Frete e prazo calculados com seu CEP antes de pagar</li>
            <li>7 dias para desistir após receber (Código de Defesa do Consumidor)</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
