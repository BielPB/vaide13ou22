import { describe, expect, it } from 'vitest'
import { storeConfig } from '../config/store'
import { addLine, cartCount, cartSubtotalCents, lineKey, removeLine, sanitizeCart, setLineQuantity, type CartLine } from './cart'
import { buildCheckoutUrl } from './purchase'

const bone: CartLine = { productId: '22', modelId: 'flavio', variantId: 'preto', quantity: 1 }
const camisa: CartLine = { productId: '13', modelId: 'camisa', variantId: 'branca-p', quantity: 2 }

describe('carrinho', () => {
  it('soma a mesma cor/tamanho na mesma linha e separa itens diferentes', () => {
    let items = addLine(storeConfig, [], bone)
    items = addLine(storeConfig, items, bone)
    items = addLine(storeConfig, items, camisa)
    expect(items).toEqual([
      { ...bone, quantity: 2 },
      { ...camisa, quantity: 2 },
    ])
    expect(cartCount(items)).toBe(4)
  })

  it('respeita o máximo por item e o mínimo de 1', () => {
    const max = storeConfig.checkout.kind === 'yampi' ? storeConfig.checkout.maxQuantity : 10
    let items = addLine(storeConfig, [], { ...bone, quantity: 50 })
    expect(items[0]!.quantity).toBe(max)
    items = setLineQuantity(storeConfig, items, lineKey(bone), 0)
    expect(items[0]!.quantity).toBe(1)
  })

  it('subtotal soma os itens (1 Flávio R$ 37,90 + 2 camisas R$ 49,90 = R$ 137,70)', () => {
    const items = addLine(storeConfig, addLine(storeConfig, [], bone), camisa)
    expect(cartSubtotalCents(storeConfig, items)).toBe(13770)
    expect(cartSubtotalCents(storeConfig, removeLine(items, lineKey(bone)))).toBe(9980)
  })

  it('gera um único link da Yampi com todos os itens (conferido no checkout em 27/09/2026)', () => {
    const items = addLine(storeConfig, addLine(storeConfig, [], bone), camisa)
    expect(buildCheckoutUrl(storeConfig, items)).toBe('https://seguro.asadeltastore.com/r/KTS6AXK3UX:1,KCY1XHMG4A:2')
  })

  it('descarta itens salvos que não existem mais ou vieram malformados', () => {
    const salvo = [bone, { productId: '22', modelId: 'nao-existe', variantId: 'x', quantity: 1 }, 'lixo', { productId: '99' }, camisa]
    expect(sanitizeCart(storeConfig, salvo)).toEqual([bone, camisa])
    expect(sanitizeCart(storeConfig, 'nada')).toEqual([])
  })
})
