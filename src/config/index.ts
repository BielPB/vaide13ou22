import { exampleConfig } from './example'
import { storeConfig } from './store'
import type { StoreConfig } from './types'

/**
 * Aplica regras que dependem do checkout: sem desconto progressivo ativo na Yampi,
 * as faixas de 2+ são removidas (o site mostra só o preço de 1 unidade).
 */
export function effectiveConfig(config: StoreConfig): StoreConfig {
  if (config.commerce.quantityDiscountActive) return config
  const strip = (p: StoreConfig['products']['13']) => ({ ...p, models: p.models.map((m) => ({ ...m, tiers: [] })) })
  const products = Object.fromEntries(Object.entries(config.products).map(([id, p]) => [id, strip(p)])) as unknown as StoreConfig['products']
  return { ...config, products }
}

/** Em produção sempre usa `store.ts`. Em dev, `?exemplo` carrega os dados de exemplo. */
export function loadConfig(): StoreConfig {
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('exemplo')) {
    return effectiveConfig(exampleConfig)
  }
  return effectiveConfig(storeConfig)
}

/** Sempre `false` em produção (o arquivo de exemplo é removido do build). */
export const isExampleData = (config: StoreConfig) =>
  import.meta.env.DEV && config.checkout.kind === 'yampi' && config.checkout.checkoutHost === 'seguro.exemplo.invalid'

export type * from './types'
