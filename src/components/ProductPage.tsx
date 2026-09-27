import { useEffect, useId, useState, type ReactNode } from 'react'
import type { ProductId, ProductModel, ProductVariant } from '../config/types'
import { formatBRL } from '../lib/format'
import { blockMessages, checkoutProviderName, discountFromCompareAt, isVariantInStock } from '../lib/purchase'
import { Link } from '../lib/router'
import { modelFullName } from '../lib/routes'
import { useCart } from '../lib/cartContext'
import { useShop } from '../lib/shop'
import { BuyButton } from './BuyButton'
import { Icon } from './Icon'
import { Pending } from './Pending'
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
      <input
        className="choice__input"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        // Clicar de novo na opção marcada não dispara onChange; repete a escolha (a galeria volta à foto da cor).
        onClick={checked ? onChange : undefined}
      />
      {children}
    </label>
  )
}

/** Caminho de volta: Início › lado › modelo. */
function Breadcrumb() {
  const { selection } = useShop()
  if (!selection?.model) return null
  const { product, model } = selection
  return (
    <nav className="crumbs" aria-label="Você está em">
      <ol>
        <li>
          <Link href="/">Início</Link>
        </li>
        <li>
          <Link href={`/#vitrine-${product.id}`}>{product.name}</Link>
        </li>
        <li aria-current="page">{modelFullName(model)}</li>
      </ol>
    </nav>
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
        Cor: <span className="pick__chosen">{current ?? 'escolha'}</span>
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
        Tamanho: <span className="pick__chosen">{variant?.size ?? (color ? 'escolha' : 'escolha a cor antes')}</span>
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
export function FreeShippingProgress({ subtotalCents }: { subtotalCents: number | null }) {
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
            Este pedido tem <strong>frete grátis</strong>
          </>
        ) : (
          <>
            Faltam <strong>{formatBRL(min - subtotalCents + 1)}</strong> para o frete grátis{region}
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
  const { subtotalCents: cartTotal } = useCart()
  const qtyId = useId()
  const summary = useReviewSummary(selection?.product.id, selection?.model?.id)
  const [pendingColor, setPendingColor] = useState<string | null>(null)
  // Conta cada escolha de cor: a galeria volta para a foto mesmo se a cor se repetir.
  const [colorTick, setColorTick] = useState(0)
  const modelKey = selection ? `${selection.product.id}/${selection.model?.id ?? ''}` : ''
  useEffect(() => setPendingColor(null), [modelKey])

  if (!selection) return null

  const { product, model, variant, quantity, rule, unitCents, subtotalCents, state } = selection
  const images = model?.images ?? [product.heroImage]
  const off = model ? discountFromCompareAt(model) : null
  const provider = checkoutProviderName(config)
  const sized = model ? hasSizes(model) : false
  const color = variant?.label ?? pendingColor

  const pickColor = (label: string) => {
    if (!model) return
    setColorTick((t) => t + 1)
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

  // Foto e aviso da cor escolhida (cor sem foto não mostra a foto de outra cor).
  const colorVariant = color ? model?.variants.find((v) => v.label === color) : undefined
  const colorImage = colorVariant?.image ?? null
  const missingLabel = colorVariant && !colorImage ? colorVariant.label : null

  // Miniatura de uma cor clicada na galeria: seleciona essa cor.
  const pickFromGallery = (src: string) => {
    const v = model?.variants.find((x) => x.image === src)
    if (v && v.label !== color) pickColor(v.label)
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
      <div className="container">
        <Breadcrumb />

        <div className="pdp__grid" id="comprar" tabIndex={-1}>
          <div className="pdp__media">
            <ProductGallery
              key={modelKey}
              title={model ? modelFullName(model) : product.name}
              images={images}
              focus={{ src: colorImage, tick: colorTick }}
              missingLabel={missingLabel}
              onPick={pickFromGallery}
              priority
            />
          </div>

          <div className="buybox">
            <p className="buybox__badge">
              {product.name}
              {variant && ` · ${variantName(variant)}`}
            </p>
            <h1 id="pdp-title" className="buybox__title">
              {model ? modelFullName(model) : product.name}
            </h1>
            {summary && (
              <a className="buybox__rating" href="#avaliacoes">
                {summary.average !== null ? (
                  <>
                    <ReviewStars value={summary.average} /> {summary.average.toFixed(1).replace('.', ',')} ({summary.count}{' '}
                    {summary.count === 1 ? 'avaliação' : 'avaliações'})
                  </>
                ) : (
                  <>
                    {summary.count} {summary.count === 1 ? 'avaliação' : 'avaliações'}
                  </>
                )}
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
                {config.commerce.payments && (
                  <p className="price-block__pay">{config.commerce.paymentsShort ?? config.commerce.payments.join(' ou ')}</p>
                )}
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
                  label={subtotalCents !== null && variant ? `Adicionar · ${formatBRL(subtotalCents)}` : 'Adicionar ao carrinho'}
                />
              </div>
            )}
            {model && <BuyButton mode="now" className="buy-now" />}

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

            {/* Frete grátis considera o que já está no carrinho mais a escolha atual. */}
            {model && <FreeShippingProgress subtotalCents={subtotalCents === null ? null : cartTotal + subtotalCents} />}

            <ul className="trust">
              <li>
                <Icon name="lock" size={18} />
                <span>Pagamento seguro {provider ? `pela ${provider}` : 'em checkout externo'}</span>
              </li>
              <li>
                <Icon name="truck" size={18} />
                <span>{config.commerce.dispatchShort ?? config.commerce.dispatchTime ?? 'Frete e prazo calculados pelo CEP'}</span>
              </li>
              <li>
                <Icon name="refresh" size={18} />
                <span>Troca ou devolução em até 7 dias</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
