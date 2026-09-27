import { useCart } from '../lib/cartContext'
import { useShop } from '../lib/shop'

/**
 * Botão de compra do produto aberto. Só funciona com a compra liberada.
 * - `cart` (padrão): adiciona a cor/tamanho/quantidade escolhidos ao carrinho.
 * - `now`: vai direto ao checkout só com este item.
 */
export function BuyButton({ className = '', label, mode = 'cart' }: { className?: string; label?: string; mode?: 'cart' | 'now' }) {
  const { selection, checkout, startCheckout } = useShop()
  const cart = useCart()
  if (!selection) return null
  const { product, model, variant, quantity, state } = selection
  const busy = mode === 'now' && checkout.kind === 'redirecting'
  const disabled = !state.canBuy || busy

  const onClick = () => {
    if (disabled) return
    if (mode === 'now') return startCheckout()
    if (model && variant) cart.add({ productId: product.id, modelId: model.id, variantId: variant.id, quantity })
  }

  return (
    <button
      type="button"
      className={`btn ${mode === 'now' ? 'btn--outline' : 'btn--buy btn--checkout'} ${className}`}
      aria-disabled={disabled}
      aria-busy={busy}
      aria-describedby={state.block ? `block-${product.id}` : undefined}
      onClick={onClick}
    >
      {busy ? 'Abrindo checkout…' : (label ?? (mode === 'now' ? 'Comprar agora' : 'Adicionar ao carrinho'))}
    </button>
  )
}
