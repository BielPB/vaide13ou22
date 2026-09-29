import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { StoreConfig } from '../config/types'
import { addLine, cartCount, cartSubtotalCents, lineKey, removeLine, sanitizeCart, setLineQuantity, type CartLine } from './cart'
import { buildCheckoutUrl, CheckoutError } from './purchase'
import { readMigrated } from './storage'
import { withCampaign } from './campaign'

/**
 * Estado do carrinho. Fica acima da página (não zera ao navegar) e é salvo só
 * no navegador do visitante (localStorage), sem cookies e sem envio a ninguém.
 */
const KEY = 'asadelta:carrinho'
/** Nome da chave antes da troca do nome da loja (o carrinho salvo é migrado). */
const OLD_KEY = 'vaide13ou22:carrinho'

interface CartValue {
  items: CartLine[]
  count: number
  subtotalCents: number
  isOpen: boolean
  error: string | null
  redirecting: boolean
  add: (line: CartLine) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  open: () => void
  close: () => void
  checkout: () => void
}

const CartContext = createContext<CartValue | null>(null)

function load(config: StoreConfig): CartLine[] {
  try {
    return sanitizeCart(config, JSON.parse(readMigrated(KEY, OLD_KEY) ?? '[]'))
  } catch {
    return []
  }
}

export function CartProvider({ config, children }: { config: StoreConfig; children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(() => load(config))
  const [isOpen, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      // Sem armazenamento (aba anônima, bloqueio): o carrinho vale só nesta visita.
    }
  }, [items])

  // Voltando do checkout pelo botão "voltar" (bfcache), libera o botão de novo.
  useEffect(() => {
    const onShow = () => setRedirecting(false)
    window.addEventListener('pageshow', onShow)
    return () => window.removeEventListener('pageshow', onShow)
  }, [])

  const add = useCallback(
    (line: CartLine) => {
      setItems((prev) => addLine(config, prev, line))
      setError(null)
      setOpen(true)
    },
    [config],
  )
  const setQuantity = useCallback((key: string, q: number) => setItems((prev) => setLineQuantity(config, prev, key, q)), [config])
  const remove = useCallback((key: string) => setItems((prev) => removeLine(prev, key)), [])
  const open = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])

  const checkout = useCallback(() => {
    if (items.length === 0) return
    try {
      // UTMs do anúncio seguem para o checkout (atribuição da venda na UTMify).
      const url = withCampaign(buildCheckoutUrl(config, items))
      setRedirecting(true)
      // Preço, estoque, frete e total final são validados pelo checkout.
      window.location.assign(url)
    } catch (err) {
      setError(err instanceof CheckoutError ? err.message : 'Não foi possível abrir o checkout. Tente novamente.')
    }
  }, [config, items])

  const value = useMemo<CartValue>(
    () => ({
      items,
      count: cartCount(items),
      subtotalCents: cartSubtotalCents(config, items),
      isOpen,
      error,
      redirecting,
      add,
      setQuantity,
      remove,
      open,
      close,
      checkout,
    }),
    [config, items, isOpen, error, redirecting, add, setQuantity, remove, open, close, checkout],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>')
  return ctx
}

export { lineKey }
