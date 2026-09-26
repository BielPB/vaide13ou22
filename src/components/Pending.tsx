import type { ReactNode } from 'react'
import { useShop } from '../lib/shop'

/**
 * Marca um dado ausente. Aparece apenas em modo prévia; na loja publicada
 * não renderiza nada (o bloco correspondente deve ser omitido).
 */
export function Pending({ field, children }: { field: string; children?: ReactNode }) {
  const { config } = useShop()
  if (config.status === 'live') return null
  return (
    <span className="pending" title={`Pendência para publicação: ${field}`}>
      <span className="pending__label">Pendente</span>
      <span className="pending__text">{children ?? field}</span>
    </span>
  )
}

/** `true` quando dados ausentes devem ser sinalizados (prévia). */
export function useShowPending() {
  return useShop().config.status !== 'live'
}
