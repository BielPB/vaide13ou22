import type { ProductId, Review } from '../config/types'
import { useShop } from '../lib/shop'

/**
 * Avaliações verificadas. Tudo aqui é calculado a partir de `config.reviews`:
 * nenhuma nota, contagem ou "útil" é inventado. Sem avaliações, a seção some.
 */

export function ReviewStars({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))
  return (
    <span className="stars" role="img" aria-label={`Nota ${value.toFixed(1).replace('.', ',')} de 5`}>
      <span className="stars__base" aria-hidden="true">
        ★★★★★
      </span>
      <span className="stars__fill" aria-hidden="true" style={{ width: `${pct}%` }}>
        ★★★★★
      </span>
    </span>
  )
}

const verified = (reviews: Review[]) => reviews.filter((r) => r.verified)

/** Média e contagem das avaliações de um modelo (ou do lado inteiro). */
export function useReviewSummary(productId?: ProductId, modelId?: string) {
  const { config } = useShop()
  const list = verified(config.reviews).filter(
    (r) => (!productId || r.productId === productId) && (!modelId || r.modelId === modelId),
  )
  if (list.length === 0) return null
  return { count: list.length, average: list.reduce((s, r) => s + r.rating, 0) / list.length }
}

export function Reviews() {
  const { config } = useShop()
  const reviews = verified(config.reviews).sort((a, b) => b.date.localeCompare(a.date))
  if (reviews.length === 0) return null

  const average = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length }))
  const modelName = (r: Review) => config.products[r.productId].models.find((m) => m.id === r.modelId)?.name ?? ''

  return (
    <section className="section section--reviews" id="avaliacoes" aria-labelledby="reviews-title">
      <div className="container">
        <header className="section__head section__head--center">
          <p className="section__eyebrow">Avaliações de clientes</p>
          <h2 id="reviews-title" className="section__title">
            Quem comprou, conta.
          </h2>
        </header>

        <div className="rv-summary">
          <p className="rv-summary__avg">
            <span className="rv-summary__num">{average.toFixed(1).replace('.', ',')}</span>
            <ReviewStars value={average} />
            <span className="rv-summary__count">
              {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
            </span>
          </p>
          <ul className="rv-dist">
            {dist.map(({ n, count }) => (
              <li key={n}>
                <span>{n} ★</span>
                <span className="rv-dist__bar" aria-hidden="true">
                  <span style={{ width: `${(count / reviews.length) * 100}%` }} />
                </span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="reviews">
          {reviews.map((r) => (
            <li key={`${r.author}-${r.date}-${r.modelId}`} className="review">
              <p className="review__head">
                <strong>{r.author}</strong>
                <ReviewStars value={r.rating} />
              </p>
              <p className="review__meta">
                {config.products[r.productId].name} · {modelName(r)}
                {r.variantLabel && ` · ${r.variantLabel}`} ·{' '}
                <time dateTime={r.date}>{new Date(`${r.date}T12:00:00`).toLocaleDateString('pt-BR')}</time>
              </p>
              <blockquote>
                <p>{r.text}</p>
              </blockquote>
              {r.photo && <img className="review__photo" src={r.photo} alt={`Foto enviada por ${r.author}`} loading="lazy" />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
