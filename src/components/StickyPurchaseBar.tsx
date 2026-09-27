import { useEffect, useState } from 'react'
import { formatBRL, scrollToAndFocus } from '../lib/format'
import { modelFullName } from '../lib/routes'
import { useShop } from '../lib/shop'
import { BuyButton } from './BuyButton'

/**
 * Barra de compra do celular. Aparece só depois da seleção e quando a área de
 * compra (#comprar) e o encerramento estão fora da tela. Some quando um campo
 * está em foco (teclado virtual) ou quando há um diálogo aberto.
 */
export function StickyPurchaseBar() {
  const { selection } = useShop()
  const [offscreen, setOffscreen] = useState(false)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    const targets = ['comprar', 'closing-title', 'site-footer']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    const visible = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target)
        else visible.delete(e.target)
      }
      setOffscreen(visible.size === 0)
    }, { rootMargin: '-96px 0px 0px 0px' }) // ignora a faixa coberta pelo cabeçalho fixo
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches('input:not([type=radio]):not([type=checkbox]), textarea, select')
    const onIn = (e: FocusEvent) => setTyping(isField(e.target))
    const onOut = () => setTyping(false)
    document.addEventListener('focusin', onIn)
    document.addEventListener('focusout', onOut)
    return () => {
      document.removeEventListener('focusin', onIn)
      document.removeEventListener('focusout', onOut)
    }
  }, [])

  const show = !!selection && offscreen && !typing

  useEffect(() => {
    document.body.classList.toggle('has-sticky-bar', show)
    return () => document.body.classList.remove('has-sticky-bar')
  }, [show])

  if (!selection) return null
  const { product, model, subtotalCents, unitCents, quantity, state } = selection
  const price = quantity > 1 ? subtotalCents : unitCents

  return (
    <div className="sticky-bar" data-show={show} data-accent={product.id} aria-hidden={!show} inert={!show}>
      <div className="sticky-bar__info">
        <span className="sticky-bar__name">
          {model ? modelFullName(model) : product.name}
        </span>
        <span className="sticky-bar__price">
          {!model ? 'Escolha o modelo' : price === null ? 'Preço a confirmar' : `${formatBRL(price)}${quantity > 1 ? ` · ${quantity} un.` : ''}`}
        </span>
      </div>
      {state.canBuy ? (
        <BuyButton label={price === null ? 'Adicionar ao carrinho' : `Adicionar · ${formatBRL(price)}`} />
      ) : (
        <button type="button" className="btn btn--ink" onClick={() => scrollToAndFocus('comprar')}>
          Escolher opções
        </button>
      )}
    </div>
  )
}
