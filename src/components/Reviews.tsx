import { useState } from 'react'
import { Lightbox } from './Lightbox'
import { ReviewVotes, reviewId } from './ReviewVotes'
import type { ProductId, ProductImage, Review } from '../config/types'
import { useShop } from '../lib/shop'

/**
 * Avaliações verificadas. Tudo aqui é calculado a partir de `config.reviews`:
 * nenhuma nota, contagem ou "útil" é inventado. Sem avaliações, a seção some.
 * Avaliação sem nota aparece sem estrelas e fica fora da média.
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

/** Avaliações verificadas de um modelo (ou do lado inteiro, ou da loja). */
function useModelReviews(productId?: ProductId, modelId?: string) {
  const { config } = useShop()
  return config.reviews.filter(
    (r) => r.verified && (!productId || r.productId === productId) && (!modelId || r.modelId === modelId),
  )
}

/** Contagem e média (só das avaliações com nota; `null` sem nenhuma nota). */
export function useReviewSummary(productId?: ProductId, modelId?: string) {
  const list = useModelReviews(productId, modelId)
  if (list.length === 0) return null
  const rated = list.filter((r): r is Review & { rating: number } => r.rating !== undefined)
  return {
    count: list.length,
    average: rated.length ? rated.reduce((s, r) => s + r.rating, 0) / rated.length : null,
    origins: [...new Set(list.map((r) => r.origin).filter(Boolean))] as string[],
  }
}

/** Quantas avaliações aparecem antes de "Ver todas". */
const FIRST = 6

const formatDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR')

/** Avaliações do produto aberto: com foto primeiro, depois as mais úteis e as mais recentes. */
export function Reviews() {
  const { selection } = useShop()
  const reviews = useModelReviews(selection?.product.id, selection?.model?.id)
    .slice()
    .sort((a, b) => Number(!!b.photo) - Number(!!a.photo) || (b.helpful ?? 0) - (a.helpful ?? 0) || b.date.localeCompare(a.date))
  const summary = useReviewSummary(selection?.product.id, selection?.model?.id)
  const [showAll, setShowAll] = useState(false)
  // Foto aberta na janela de ampliação (índice em `photos`); null = fechada.
  const [zoom, setZoom] = useState<number | null>(null)
  if (!summary || reviews.length === 0) return null
  const shown = showAll ? reviews : reviews.slice(0, FIRST)
  // Fotos das avaliações visíveis, na mesma ordem, para navegar com as setas.
  const withPhoto = shown.filter((r) => r.photo)
  const photos: ProductImage[] = withPhoto.map((r) => ({
    src: r.photo!,
    label: [r.author, r.variantLabel].filter(Boolean).join(' · '),
    alt: `Foto enviada por ${r.author}`,
    // Proporção aproximada (fotos de celular em pé); o navegador usa a real ao carregar.
    width: 900,
    height: 1200,
    illustrative: false,
  }))

  const rated = reviews.filter((r) => r.rating !== undefined)
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: rated.filter((r) => r.rating === n).length }))
  const origin = summary.origins.length === 1 ? summary.origins[0] : null

  return (
    <section className="section section--reviews" id="avaliacoes" aria-labelledby="reviews-title">
      <div className="container">
        <header className="section__head section__head--center">
          <p className="section__eyebrow">Avaliações</p>
          <h2 id="reviews-title" className="section__title">
            O que dizem os clientes
          </h2>
          <p className="rv-lead">
            {summary.count} {summary.count === 1 ? 'avaliação' : 'avaliações'}
            {origin && ` de compras feitas na nossa loja da ${origin}`}
          </p>
        </header>

        {summary.average !== null && (
          <div className="rv-summary">
            <p className="rv-summary__avg">
              <span className="rv-summary__num">{summary.average.toFixed(1).replace('.', ',')}</span>
              <ReviewStars value={summary.average} />
              <span className="rv-summary__count">
                {rated.length} {rated.length === 1 ? 'nota' : 'notas'}
              </span>
            </p>
            <ul className="rv-dist">
              {dist.map(({ n, count }) => (
                <li key={n}>
                  <span>{n} ★</span>
                  <span className="rv-dist__bar" aria-hidden="true">
                    <span style={{ width: `${(count / rated.length) * 100}%` }} />
                  </span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="reviews" id="lista-avaliacoes">
          {shown.map((r) => (
            <li key={reviewId(r)} className="review">
              <p className="review__head">
                <strong>{r.author}</strong>
                {r.rating !== undefined && <ReviewStars value={r.rating} />}
              </p>
              <p className="review__meta">
                <time dateTime={r.date}>{formatDate(r.date)}</time>
                {r.variantLabel && ` · ${r.variantLabel}`}
              </p>
              {r.details && r.details.length > 0 && (
                <dl className="review__details">
                  {r.details.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}:</dt> <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {r.text && (
                <blockquote>
                  <p>{r.text}</p>
                </blockquote>
              )}
              {r.sellerReply && (
                <div className="review__reply">
                  <p className="review__reply-title">Resposta da loja</p>
                  <p>{r.sellerReply}</p>
                </div>
              )}
              {r.photo && (
                <button
                  type="button"
                  className="review__photo-link"
                  aria-label={`Ampliar foto enviada por ${r.author}`}
                  onClick={() => setZoom(withPhoto.indexOf(r))}
                >
                  <img className="review__photo" src={r.photo} alt="" loading="lazy" />
                </button>
              )}
              <ReviewVotes id={reviewId(r)} helpful={r.helpful ?? 0} />
            </li>
          ))}
        </ul>
        <Lightbox title="Fotos dos clientes" images={photos} index={zoom} onIndexChange={setZoom} onClose={() => setZoom(null)} />
        {reviews.length > FIRST && !showAll && (
          <p className="rv-more">
            <button type="button" className="btn btn--outline" aria-controls="lista-avaliacoes" onClick={() => setShowAll(true)}>
              Ver todas as {reviews.length} avaliações
            </button>
          </p>
        )}
      </div>
    </section>
  )
}
