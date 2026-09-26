import type { ProductImage } from '../config/types'
import { Pending } from './Pending'

/**
 * Imagem de produto com dimensões reservadas (sem salto de layout).
 * - Ilustrações recebem o selo "Ilustração".
 * - Fotos ausentes viram um espaço sinalizado, no mesmo formato.
 */
export function ProductImageView({
  image,
  priority = false,
  sizes = '(min-width: 900px) 50vw, 100vw',
  showBadge = true,
  frame,
}: {
  image: ProductImage
  priority?: boolean
  sizes?: string
  showBadge?: boolean
  /** Proporção fixa do quadro (ex.: "4 / 3"). A imagem se ajusta sem cortar. */
  frame?: string
}) {
  const ratio = frame ?? `${image.width} / ${image.height}`

  if (!image.src) {
    return (
      <div className="pimg pimg--missing" style={{ aspectRatio: ratio }} role="img" aria-label={`Foto ainda não disponível: ${image.label}`}>
        <svg className="pimg__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h3l2-2h6l2 2h3v12H4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="pimg__missing-text">{image.label}</span>
        <Pending field="FOTOS_REAIS">foto real</Pending>
      </div>
    )
  }

  return (
    <div className={`pimg${image.illustrative ? '' : ' pimg--photo'}`} style={{ aspectRatio: ratio }}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
      />
      {showBadge && image.illustrative && <span className="pimg__badge">Ilustração</span>}
    </div>
  )
}
