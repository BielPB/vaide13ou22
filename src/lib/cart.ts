import type { ProductModel, ProductVariant, StoreConfig } from '../config/types'
import { isVariantInStock, quantityRule, subtotalCents, type PurchaseLine } from './purchase'

/**
 * Carrinho: lógica pura (sem React). Cada linha é um produto + cor/tamanho;
 * o checkout da Yampi recebe todas as linhas num único link (/r/TOKEN:QTD,TOKEN:QTD).
 */
export type CartLine = PurchaseLine

export const lineKey = (l: Pick<CartLine, 'productId' | 'modelId' | 'variantId'>) => `${l.productId}/${l.modelId}/${l.variantId}`

export function findLine(config: StoreConfig, line: Pick<CartLine, 'productId' | 'modelId' | 'variantId'>) {
  const product = config.products[line.productId]
  const model: ProductModel | undefined = product?.models.find((m) => m.id === line.modelId)
  const variant: ProductVariant | undefined = model?.variants.find((v) => v.id === line.variantId)
  return product && model && variant ? { product, model, variant } : null
}

const maxFor = (config: StoreConfig, line: CartLine) => quantityRule(config, findLine(config, line)?.variant ?? null).max

/** Adiciona ao carrinho; a mesma cor/tamanho soma na linha existente (até o máximo). */
export function addLine(config: StoreConfig, items: CartLine[], line: CartLine): CartLine[] {
  const key = lineKey(line)
  const max = maxFor(config, line)
  const existing = items.find((i) => lineKey(i) === key)
  if (existing) return items.map((i) => (i === existing ? { ...i, quantity: Math.min(max, i.quantity + line.quantity) } : i))
  return [...items, { ...line, quantity: Math.min(max, Math.max(1, line.quantity)) }]
}

export function setLineQuantity(config: StoreConfig, items: CartLine[], key: string, quantity: number): CartLine[] {
  return items.map((i) => (lineKey(i) === key ? { ...i, quantity: Math.min(maxFor(config, i), Math.max(1, Math.round(quantity) || 1)) } : i))
}

export const removeLine = (items: CartLine[], key: string) => items.filter((i) => lineKey(i) !== key)

export const cartCount = (items: CartLine[]) => items.reduce((n, i) => n + i.quantity, 0)

export function cartSubtotalCents(config: StoreConfig, items: CartLine[]): number {
  return items.reduce((sum, i) => {
    const found = findLine(config, i)
    return sum + (found ? (subtotalCents(found.model, i.quantity) ?? 0) : 0)
  }, 0)
}

/**
 * Lê o carrinho salvo no navegador com desconfiança: descarta o que não existe
 * mais, o que está esgotado ou sem link de compra, e corrige quantidades.
 */
export function sanitizeCart(config: StoreConfig, raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return []
  let items: CartLine[] = []
  for (const r of raw) {
    if (!r || typeof r !== 'object') continue
    const { productId, modelId, variantId, quantity } = r as Record<string, unknown>
    if ((productId !== '13' && productId !== '22') || typeof modelId !== 'string' || typeof variantId !== 'string') continue
    const line: CartLine = { productId, modelId, variantId, quantity: typeof quantity === 'number' ? quantity : 1 }
    const found = findLine(config, line)
    if (!found || !isVariantInStock(found.variant) || !found.variant.checkoutUrl) continue
    items = addLine(config, items, line)
  }
  return items
}
