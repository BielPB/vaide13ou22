import type { Product, ProductModel, ProductVariant, StoreConfig } from '../config/types'
import { hasEssential, modelPending, storePending } from './pending'

/**
 * Uma linha de compra. A interface atual compra um item por vez, mas toda a
 * lógica trabalha com `PurchaseLine[]` para permitir um carrinho no futuro.
 */
export interface PurchaseLine {
  productId: Product['id']
  modelId: string
  variantId: string
  quantity: number
}

/** Limite de quantidade exibido quando ainda não há checkout configurado. */
export const PREVIEW_MAX_QUANTITY = 10

/** Preço de 1 unidade considerando a faixa de quantidade (ex.: 2 ou mais). */
export function unitPriceCents(model: ProductModel, quantity: number): number | null {
  if (model.priceCents === null) return null
  const tier = [...model.tiers]
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find((t) => quantity >= t.minQuantity)
  return tier ? tier.priceCents : model.priceCents
}

/** Faixa de quantidade atingida (a maior), se houver. */
export function activeTier(model: ProductModel, quantity: number) {
  return [...model.tiers].sort((a, b) => b.minQuantity - a.minQuantity).find((t) => quantity >= t.minQuantity) ?? null
}

/**
 * Subtotal como o checkout da Yampi calcula: preço cheio × quantidade, menos a
 * porcentagem da faixa atingida, arredondado ao centavo.
 */
export function subtotalCents(model: ProductModel, quantity: number): number | null {
  if (model.priceCents === null) return null
  const gross = model.priceCents * quantity
  const tier = activeTier(model, quantity)
  return tier ? Math.round(gross * (1 - tier.percent / 100)) : gross
}

/** Desconto sobre o preço anterior real, em % inteiro arredondado para baixo (nunca exagera). */
export function discountFromCompareAt(model: ProductModel): { wasCents: number; percent: number; savedCents: number } | null {
  const was = model.compareAtCents
  const now = model.priceCents
  if (!was || now === null || was <= now) return null
  return { wasCents: was, percent: Math.floor(((was - now) / was) * 100), savedCents: was - now }
}

/** Menor preço de 1 unidade entre os modelos com preço ("a partir de"). */
export function lowestPriceCents(product: Product): number | null {
  const prices = product.models.map((m) => m.priceCents).filter((p): p is number => p !== null)
  return prices.length ? Math.min(...prices) : null
}

export function isVariantInStock(variant: ProductVariant): boolean {
  return variant.available && variant.stock !== 0
}

export interface QuantityRule {
  max: number
  /** `true` quando a página não deve oferecer seletor de quantidade. */
  fixed: boolean
  /** Explicação exibida junto à quantidade, quando houver limitação. */
  note: string | null
}

export function quantityRule(config: StoreConfig, variant: ProductVariant | null): QuantityRule {
  const stockCap = variant?.stock ?? Infinity
  const { checkout } = config
  if (checkout.kind === 'yampi') {
    return { max: Math.max(1, Math.min(checkout.maxQuantity, stockCap)), fixed: false, note: null }
  }
  if (checkout.kind === 'link') {
    switch (checkout.quantity.mode) {
      case 'fixed-one':
        return { max: 1, fixed: true, note: 'Este checkout aceita 1 unidade por pedido.' }
      case 'chosen-at-checkout':
        return { max: 1, fixed: true, note: 'A quantidade é escolhida na página de pagamento.' }
      case 'param':
        return { max: Math.max(1, Math.min(checkout.quantity.max, stockCap)), fixed: false, note: null }
    }
  }
  return { max: Math.max(1, Math.min(PREVIEW_MAX_QUANTITY, stockCap)), fixed: false, note: null }
}

export function clampQuantity(qty: number, rule: QuantityRule): number {
  if (!Number.isFinite(qty)) return 1
  return Math.min(rule.max, Math.max(1, Math.floor(qty)))
}

export type PurchaseBlock =
  | 'preview'
  | 'models-missing'
  | 'model-not-chosen'
  | 'price-missing'
  | 'variants-missing'
  | 'variant-not-chosen'
  | 'out-of-stock'
  | 'checkout-missing'
  | 'product-incomplete'

export const blockMessages: Record<PurchaseBlock, string> = {
  preview: 'Prévia de demonstração: a compra fica disponível quando a loja for publicada.',
  'models-missing': 'Modelos ainda não cadastrados.',
  'model-not-chosen': 'Escolha o modelo para continuar.',
  'price-missing': 'Preço ainda não confirmado.',
  'variants-missing': 'Cores/opções ainda não cadastradas.',
  'variant-not-chosen': 'Escolha a cor para continuar.',
  'out-of-stock': 'Esta opção está esgotada.',
  'checkout-missing': 'Compra indisponível: checkout ainda não configurado para esta opção.',
  'product-incomplete': 'Compra indisponível: faltam informações obrigatórias deste modelo.',
}

export interface PurchaseState {
  canBuy: boolean
  block: PurchaseBlock | null
}

export function checkoutConfigured(config: StoreConfig): boolean {
  if (config.checkout.kind === 'none') return false
  if (config.checkout.kind === 'yampi') return !!config.checkout.checkoutHost
  return true
}

/** Nome exibido do ambiente de pagamento, quando configurado. */
export function checkoutProviderName(config: StoreConfig): string | null {
  if (config.checkout.kind === 'yampi') return 'Yampi'
  if (config.checkout.kind === 'link') return config.checkout.providerName
  return null
}

/**
 * Decide se o botão de compra pode enviar o visitante ao checkout.
 * A ordem das verificações define qual mensagem aparece primeiro.
 */
export function purchaseState(
  config: StoreConfig,
  product: Product,
  model: ProductModel | null,
  variant: ProductVariant | null,
): PurchaseState {
  const blocked = (block: PurchaseBlock): PurchaseState => ({ canBuy: false, block })

  if (product.models.length === 0) return blocked('models-missing')
  if (!model) return blocked('model-not-chosen')
  if (model.priceCents === null) return blocked('price-missing')
  if (model.variants.length === 0) return blocked('variants-missing')
  if (!variant) return blocked('variant-not-chosen')
  if (!isVariantInStock(variant)) return blocked('out-of-stock')
  if (!checkoutConfigured(config) || !variant.checkoutUrl) return blocked('checkout-missing')
  if (config.status !== 'live' || hasEssential(storePending(config))) return blocked('preview')
  if (hasEssential(modelPending(product, model, config))) return blocked('product-incomplete')
  return { canBuy: true, block: null }
}

export class CheckoutError extends Error {}

interface ResolvedLine {
  line: PurchaseLine
  url: URL
}

/** Valida uma linha do pedido: produto, modelo, cor, estado de compra, quantidade e link. */
function resolveLine(config: StoreConfig, line: PurchaseLine): ResolvedLine {
  const product = config.products[line.productId]
  const model = product.models.find((m) => m.id === line.modelId)
  if (!model) throw new CheckoutError('Modelo não encontrado.')
  const variant = model.variants.find((v) => v.id === line.variantId)
  if (!variant) throw new CheckoutError('Opção do produto não encontrada.')

  const state = purchaseState(config, product, model, variant)
  if (!state.canBuy) throw new CheckoutError(blockMessages[state.block!])

  const rule = quantityRule(config, variant)
  if (line.quantity !== clampQuantity(line.quantity, rule)) {
    throw new CheckoutError(`Quantidade indisponível. Máximo: ${rule.max}.`)
  }

  let url: URL
  try {
    url = new URL(variant.checkoutUrl!)
  } catch {
    throw new CheckoutError('O link de checkout desta opção é inválido.')
  }
  if (url.protocol !== 'https:') throw new CheckoutError('O link de checkout precisa usar HTTPS.')
  return { line, url }
}

/** Extrai o token de um Link de compra da Yampi (…/r/TOKEN ou …/r/TOKEN:1). */
export function yampiToken(url: URL, expectedHost: string): string {
  if (url.hostname !== expectedHost) {
    throw new CheckoutError(`O link desta opção não é do checkout configurado (${expectedHost}).`)
  }
  const match = /^\/r\/([A-Za-z0-9_-]+)(?::\d+)?\/?$/.exec(url.pathname)
  if (!match) throw new CheckoutError('O link desta opção não parece um Link de compra da Yampi (/r/TOKEN).')
  return match[1]!
}

/**
 * Monta o endereço do checkout externo. Não acrescenta parâmetros que o
 * provedor não suporta.
 * - Yampi: https://HOST/r/TOKEN:QTD[,TOKEN2:QTD] — aceita vários itens.
 * - Link genérico: um item; quantidade só no modo `param`.
 */
export function buildCheckoutUrl(config: StoreConfig, lines: PurchaseLine[]): string {
  const { checkout } = config
  if (!checkoutConfigured(config) || checkout.kind === 'none') throw new CheckoutError('Nenhum checkout configurado.')
  if (lines.length === 0) throw new CheckoutError('Nenhum item no pedido.')
  const resolved = lines.map((line) => resolveLine(config, line))

  if (checkout.kind === 'yampi') {
    const host = checkout.checkoutHost!
    const items = new Map<string, number>()
    for (const r of resolved) {
      const token = yampiToken(r.url, host)
      items.set(token, (items.get(token) ?? 0) + r.line.quantity)
    }
    const path = [...items].map(([token, qty]) => `${token}:${qty}`).join(',')
    // A Yampi aceita 1 cupom por pedido: só envia quando um único cupom foi atingido.
    const coupons = new Set(
      lines.map((l) => {
        const model = config.products[l.productId].models.find((m) => m.id === l.modelId)!
        return activeTier(model, l.quantity)?.coupon ?? null
      }).filter((c): c is string => c !== null),
    )
    const [coupon] = [...coupons]
    const query = coupons.size === 1 && coupon ? `?promocode=${encodeURIComponent(coupon)}` : ''
    return `https://${host}/r/${path}${query}`
  }

  if (resolved.length !== 1) {
    throw new CheckoutError('Pedidos com mais de um modelo ainda não são suportados por este checkout.')
  }
  const [{ url, line }] = resolved as [ResolvedLine]
  if (checkout.quantity.mode === 'param') url.searchParams.set(checkout.quantity.param, String(line.quantity))
  return url.toString()
}
