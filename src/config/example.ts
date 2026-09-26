import { storeConfig } from './store'
import type { StoreConfig } from './types'

/**
 * DADOS DE EXEMPLO — somente em desenvolvimento (`npm run dev`, URL com ?exemplo).
 * Mesmo catálogo real, com um domínio de checkout fictício (.invalid) para
 * revisar a interface. Nenhum link de compra é criado; a compra segue bloqueada.
 * Este arquivo não entra no build de produção.
 */
export const exampleConfig: StoreConfig = {
  ...storeConfig,
  status: 'preview',
  checkout: { kind: 'yampi', checkoutHost: 'seguro.exemplo.invalid', maxQuantity: 10 },
}
