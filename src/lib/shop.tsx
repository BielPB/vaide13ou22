import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { DefaultSelection, Product, ProductId, ProductModel, ProductVariant, StoreConfig } from '../config/types'
import {
  buildCheckoutUrl,
  CheckoutError,
  clampQuantity,
  purchaseState,
  quantityRule,
  subtotalCents as calcSubtotal,
  unitPriceCents,
  type PurchaseState,
  type QuantityRule,
} from './purchase'
import { withCampaign } from './campaign'

type CheckoutStatus = { kind: 'idle' } | { kind: 'redirecting' } | { kind: 'error'; message: string }

export interface Selection {
  product: Product
  model: ProductModel | null
  variant: ProductVariant | null
  quantity: number
  rule: QuantityRule
  /** Preço de 1 unidade já com a faixa de quantidade aplicada. */
  unitCents: number | null
  subtotalCents: number | null
  state: PurchaseState
}

interface ShopContextValue {
  config: StoreConfig
  selectedId: ProductId | null
  selection: Selection | null
  checkout: CheckoutStatus
  /** Seleciona um modelo; com `productId`, troca também de lado (13/22). */
  selectModel: (modelId: string, productId?: ProductId) => void
  selectVariant: (variantId: string | null) => void
  setQuantity: (qty: number) => void
  startCheckout: () => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

/** Pré-seleciona apenas quando só existe uma escolha possível. */
const only = <T extends { id: string }>(items: T[]) => (items.length === 1 ? items[0]!.id : null)
const variantKey = (productId: ProductId, modelId: string) => `${productId}/${modelId}`

export function ShopProvider({
  config,
  initial = null,
  children,
}: {
  config: StoreConfig
  /** Produto aberto pela página (a página de produto passa o modelo dela; a inicial, nada). */
  initial?: DefaultSelection | null
  children: ReactNode
}) {
  // A escolha vive só na memória desta aba: não é salva, enviada ou medida.
  const [selectedId, setSelectedId] = useState<ProductId | null>(initial?.productId ?? null)
  const [modelIds, setModelIds] = useState<Record<ProductId, string | null>>(() => ({
    '13': initial?.productId === '13' ? initial.modelId : only(config.products['13'].models),
    '22': initial?.productId === '22' ? initial.modelId : only(config.products['22'].models),
    alfaiataria: initial?.productId === 'alfaiataria' ? initial.modelId : only(config.products.alfaiataria.models),
  }))
  const [variantIds, setVariantIds] = useState<Record<string, string | null>>(() =>
    initial?.variantId ? { [variantKey(initial.productId, initial.modelId)]: initial.variantId } : {},
  )
  const [rawQuantity, setRawQuantity] = useState(1)
  const [checkout, setCheckout] = useState<CheckoutStatus>({ kind: 'idle' })

  // Ao voltar do checkout pelo botão "voltar" (bfcache), libera o botão de novo.
  useEffect(() => {
    const onShow = () => setCheckout({ kind: 'idle' })
    window.addEventListener('pageshow', onShow)
    return () => window.removeEventListener('pageshow', onShow)
  }, [])

  const selection = useMemo<Selection | null>(() => {
    if (!selectedId) return null
    const product = config.products[selectedId]
    const model = product.models.find((m) => m.id === modelIds[selectedId]) ?? null
    const chosenVariant = model ? (variantIds[variantKey(selectedId, model.id)] ?? only(model.variants)) : null
    const variant = model?.variants.find((v) => v.id === chosenVariant) ?? null
    const rule = quantityRule(config, variant)
    const quantity = clampQuantity(rawQuantity, rule)
    const unitCents = model ? unitPriceCents(model, quantity) : null
    return {
      product,
      model,
      variant,
      quantity,
      rule,
      unitCents,
      subtotalCents: model ? calcSubtotal(model, quantity) : null,
      state: purchaseState(config, product, model, variant),
    }
  }, [config, selectedId, modelIds, variantIds, rawQuantity])

  const selectModel = useCallback(
    (modelId: string, productId?: ProductId) => {
      const pid = productId ?? selectedId
      if (!pid) return
      if (pid !== selectedId) {
        setSelectedId(pid)
        setRawQuantity(1)
      }
      setModelIds((prev) => ({ ...prev, [pid]: modelId }))
      setCheckout({ kind: 'idle' })
    },
    [selectedId],
  )

  const selectVariant = useCallback(
    (variantId: string | null) => {
      const modelId = selectedId && modelIds[selectedId]
      if (!selectedId || !modelId) return
      setVariantIds((prev) => ({ ...prev, [variantKey(selectedId, modelId)]: variantId }))
      setCheckout({ kind: 'idle' })
    },
    [selectedId, modelIds],
  )

  const setQuantity = useCallback((qty: number) => {
    setRawQuantity(qty)
    setCheckout({ kind: 'idle' })
  }, [])

  const startCheckout = useCallback(() => {
    if (!selection?.model || !selection.variant) return
    try {
      const url = withCampaign(buildCheckoutUrl(config, [
        {
          productId: selection.product.id,
          modelId: selection.model.id,
          variantId: selection.variant.id,
          quantity: selection.quantity,
        },
      ]))
      setCheckout({ kind: 'redirecting' })
      // Preço, estoque, frete e total final são validados pelo checkout.
      window.location.assign(url)
    } catch (err) {
      const message = err instanceof CheckoutError ? err.message : 'Não foi possível abrir o checkout. Tente novamente.'
      setCheckout({ kind: 'error', message })
    }
  }, [config, selection])

  const value = useMemo(
    () => ({ config, selectedId, selection, checkout, selectModel, selectVariant, setQuantity, startCheckout }),
    [config, selectedId, selection, checkout, selectModel, selectVariant, setQuantity, startCheckout],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop precisa estar dentro de <ShopProvider>')
  return ctx
}
