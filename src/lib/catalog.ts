import type { Product, ProductId, StoreConfig } from '../config/types'

/** Todos os grupos de produtos, na ordem da loja. */
export const PRODUCT_IDS: ProductId[] = ['13', '22', 'alfaiataria']

/** Grupos ligados (`enabled` diferente de `false`): os únicos que aparecem e vendem. */
export function activeProducts(config: StoreConfig): Product[] {
  return PRODUCT_IDS.map((id) => config.products[id]).filter((p) => p.enabled !== false)
}

export const isProductActive = (config: StoreConfig, id: ProductId) => config.products[id].enabled !== false
