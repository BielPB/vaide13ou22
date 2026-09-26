import { useEffect, useState } from 'react'
import type { ProductImage } from '../config/types'
import { useShop } from '../lib/shop'
import { Lightbox } from './Lightbox'
import { ProductImageView } from './ProductImageView'

/** Na loja publicada, espaços de foto vazios não aparecem. */
export function useVisibleImages(images: ProductImage[]) {
  const { config } = useShop()
  return config.status === 'live' ? images.filter((img) => img.src) : images
}

/**
 * Galeria com foto principal, miniaturas e ampliação.
 * `focusSrc` leva a galeria até uma foto (ex.: a da cor escolhida).
 */
export function ProductGallery({
  title,
  images: all,
  focusSrc,
  priority = false,
}: {
  title: string
  images: ProductImage[]
  focusSrc?: string | null
  /** Primeira foto da página: carrega com prioridade (sem lazy). */
  priority?: boolean
}) {
  const images = useVisibleImages(all)
  const zoomable = images.filter((img) => img.src)
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<number | null>(null)

  useEffect(() => {
    if (!focusSrc) return
    const i = images.findIndex((img) => img.src === focusSrc)
    if (i >= 0) setActive(i)
    // Reage só à troca de foco (cor escolhida), não a cada renderização.
  }, [focusSrc])

  const current = images[Math.min(active, images.length - 1)]
  if (!current) return null

  return (
    <div className="gallery">
      <div className="gallery__main">
        <ProductImageView image={current} frame="1 / 1" priority={priority} sizes="(min-width: 900px) 50vw, 100vw" />
        {current.src && (
          <button type="button" className="gallery__zoom" onClick={() => setZoom(zoomable.indexOf(current))}>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18">
              <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M15 15l5 5M10.5 8v5M8 10.5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Ampliar<span className="visually-hidden"> foto: {current.label}</span>
          </button>
        )}
      </div>

      {images.length > 1 && (
        <ul className="gallery__thumbs" aria-label={`Fotos: ${title}`}>
          {images.map((img, i) => (
            <li key={`${img.src}-${img.label}`}>
              <button
                type="button"
                className="gallery__thumb"
                aria-pressed={i === active}
                aria-label={`Mostrar foto: ${img.label}`}
                onClick={() => setActive(i)}
              >
                <ProductImageView image={img} frame="1 / 1" showBadge={false} sizes="96px" />
                <span className="gallery__thumb-label">{img.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Lightbox
        title={title}
        images={zoomable}
        index={zoom}
        onIndexChange={(i) => {
          setZoom(i)
          setActive(images.indexOf(zoomable[i]!))
        }}
        onClose={() => setZoom(null)}
      />
    </div>
  )
}
