import { useShop } from '../lib/shop'

/** Botão de compra: só envia ao checkout quando a compra está liberada. */
export function BuyButton({ className = '', label }: { className?: string; label?: string }) {
  const { selection, checkout, startCheckout } = useShop()
  if (!selection) return null
  const { product, state } = selection
  const busy = checkout.kind === 'redirecting'
  const disabled = !state.canBuy || busy

  return (
    <button
      type="button"
      className={`btn btn--buy btn--accent ${className}`}
      aria-disabled={disabled}
      aria-busy={busy}
      aria-describedby={state.block ? `block-${product.id}` : undefined}
      onClick={() => {
        if (!disabled) startCheckout()
      }}
    >
      {busy ? 'Abrindo checkout…' : (label ?? `Comprar ${product.shortName}`)}
    </button>
  )
}
