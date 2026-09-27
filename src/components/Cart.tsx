import { useEffect, useRef } from 'react'
import { lineKey, findLine } from '../lib/cart'
import { useCart } from '../lib/cartContext'
import { formatBRL } from '../lib/format'
import { subtotalCents } from '../lib/purchase'
import { Link } from '../lib/router'
import { modelFullName, productPath } from '../lib/routes'
import { useShop } from '../lib/shop'
import { Icon } from './Icon'
import { FreeShippingProgress, variantName } from './ProductPage'

/** Sacola no cabeçalho, com a quantidade de itens. */
export function CartButton() {
  const { count, open } = useCart()
  return (
    <button type="button" className="cart-btn" onClick={open} aria-label={`Carrinho: ${count} ${count === 1 ? 'item' : 'itens'}`}>
      <Icon name="bag" size={22} />
      {count > 0 && (
        <span className="cart-btn__count" aria-hidden="true">
          {count}
        </span>
      )}
    </button>
  )
}

/** Painel lateral do carrinho (<dialog>: Esc e clique fora fecham, foco preso no painel). */
export function CartDrawer() {
  const { config } = useShop()
  const { items, count, subtotalCents: total, isOpen, close, setQuantity, remove, checkout, error, redirecting } = useCart()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  return (
    <dialog
      ref={ref}
      className="cart"
      aria-labelledby="cart-title"
      onClose={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="cart__panel">
        <header className="cart__head">
          <h2 id="cart-title" className="cart__title">
            Seu carrinho{count > 0 && <span className="cart__count"> ({count})</span>}
          </h2>
          <button type="button" className="icon-btn" onClick={close} autoFocus>
            <span aria-hidden="true">✕</span>
            <span className="visually-hidden">Fechar carrinho</span>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart__empty">
            <p>Seu carrinho está vazio.</p>
            <Link className="btn btn--outline" href="/#vitrine-13" onClick={close}>
              Ver produtos
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart__items">
              {items.map((line) => {
                const found = findLine(config, line)
                if (!found) return null
                const { product, model, variant } = found
                const key = lineKey(line)
                const img = variant.image ?? model.images.find((i) => i.src)?.src ?? null
                const name = modelFullName(model)
                return (
                  <li key={key} className="citem">
                    {img && <img className="citem__img" src={img} alt="" width={72} height={72} loading="lazy" />}
                    <div className="citem__info">
                      <Link className="citem__name" href={productPath(product, model)} onClick={close}>
                        {name}
                      </Link>
                      <span className="citem__variant">{variantName(variant)}</span>
                      <div className="citem__row">
                        <div className="stepper citem__stepper" role="group" aria-label={`Quantidade de ${name}`}>
                          <button
                            type="button"
                            className="stepper__btn"
                            onClick={() => setQuantity(key, line.quantity - 1)}
                            disabled={line.quantity <= 1}
                            aria-label="Diminuir quantidade"
                          >
                            −
                          </button>
                          <output className="citem__qty">{line.quantity}</output>
                          <button type="button" className="stepper__btn" onClick={() => setQuantity(key, line.quantity + 1)} aria-label="Aumentar quantidade">
                            +
                          </button>
                        </div>
                        <strong className="citem__price">{formatBRL(subtotalCents(model, line.quantity) ?? 0)}</strong>
                      </div>
                    </div>
                    <button type="button" className="icon-btn citem__remove" onClick={() => remove(key)}>
                      <Icon name="trash" size={18} />
                      <span className="visually-hidden">Remover {name} do carrinho</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <footer className="cart__foot">
              <FreeShippingProgress subtotalCents={total} />
              <p className="cart__total">
                <span>Subtotal</span>
                <strong>{formatBRL(total)}</strong>
              </p>
              <p className="cart__note">Frete e prazo calculados pelo CEP no checkout.</p>
              {error && (
                <p className="summary__error" role="alert">
                  {error}
                </p>
              )}
              <button type="button" className="btn btn--checkout btn--large cart__go" onClick={checkout} aria-busy={redirecting}>
                {redirecting ? 'Abrindo checkout…' : 'Finalizar compra'}
              </button>
              <button type="button" className="cart__continue" onClick={close}>
                Continuar comprando
              </button>
            </footer>
          </>
        )}
      </div>
    </dialog>
  )
}
