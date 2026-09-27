import { useEffect, useState } from 'react'
import type { Review } from '../config/types'

/**
 * Botões "Útil" / "Não útil" de cada avaliação.
 * Sem servidor: o voto fica salvo só no navegador de quem clicou (localStorage).
 * O número de "Útil" parte do que veio da origem (ex.: Shopee) e soma o voto
 * deste visitante; nada é inventado nem somado de outros visitantes.
 */
type Vote = 'up' | 'down'
const KEY = 'vaide13ou22:votos-avaliacoes'

export const reviewId = (r: Review) => [r.productId, r.modelId, r.author, r.date, r.variantLabel ?? ''].join('|')

function readVotes(): Record<string, Vote> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, Vote>
  } catch {
    return {}
  }
}

function saveVote(id: string, vote: Vote | null) {
  try {
    const all = readVotes()
    if (vote) all[id] = vote
    else delete all[id]
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    // Navegador sem armazenamento (aba anônima, bloqueio): o voto vale só nesta visita.
  }
}

function Thumb({ down = false }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={down ? { transform: 'rotate(180deg)' } : undefined}>
      <path
        d="M7 11v9H4v-9zM7 11l4-8c1.7 0 2.6 1.2 2.2 2.8L12.6 9H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ReviewVotes({ id, helpful }: { id: string; helpful: number }) {
  const [vote, setVote] = useState<Vote | null>(null)
  useEffect(() => setVote(readVotes()[id] ?? null), [id])

  const toggle = (v: Vote) => {
    const next = vote === v ? null : v
    setVote(next)
    saveVote(id, next)
  }
  const up = helpful + (vote === 'up' ? 1 : 0)
  const down = vote === 'down' ? 1 : 0

  return (
    <div className="votes" role="group" aria-label="Esta avaliação foi útil?">
      <button type="button" className="vote" aria-pressed={vote === 'up'} onClick={() => toggle('up')}>
        <Thumb />
        Útil{up > 0 && <span className="vote__count">{up}</span>}
      </button>
      <button type="button" className="vote" aria-pressed={vote === 'down'} onClick={() => toggle('down')}>
        <Thumb down />
        Não útil{down > 0 && <span className="vote__count">{down}</span>}
      </button>
    </div>
  )
}
