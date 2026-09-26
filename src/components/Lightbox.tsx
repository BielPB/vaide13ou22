import { useEffect, useRef } from 'react'
import type { ProductImage } from '../config/types'

/**
 * Ampliação de fotos com <dialog> nativo: foco preso no diálogo, Esc fecha,
 * o foco volta ao botão que abriu. Setas ← → navegam entre as fotos.
 */
export function Lightbox({
  title,
  images,
  index,
  onIndexChange,
  onClose,
}: {
  title: string
  images: ProductImage[]
  index: number | null
  onIndexChange: (i: number) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const open = index !== null

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const count = images.length
  const current = index !== null ? images[index] : undefined
  const go = (delta: number) => index !== null && onIndexChange((index + delta + count) % count)

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={`Fotos ampliadas: ${title}`}
      onClose={onClose}
      onClick={(e) => {
        // Clique fora da imagem (no fundo) fecha.
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      {current && (
        <div className="lightbox__body">
          <div className="lightbox__bar">
            <p className="lightbox__caption" aria-live="polite">
              {title} · {current.label}
              {current.illustrative && ' · Ilustração'} <span className="lightbox__count">({index! + 1} de {count})</span>
            </p>
            <button type="button" className="icon-btn" onClick={onClose} autoFocus>
              <span aria-hidden="true">✕</span>
              <span className="visually-hidden">Fechar fotos ampliadas</span>
            </button>
          </div>
          <div className="lightbox__stage">
            {current.src ? (
              <img src={current.src} srcSet={current.srcSet} sizes="100vw" alt={current.alt} width={current.width} height={current.height} />
            ) : (
              <p className="lightbox__missing">Foto ainda não disponível.</p>
            )}
          </div>
          {count > 1 && (
            <div className="lightbox__nav">
              <button type="button" className="icon-btn" onClick={() => go(-1)}>
                <span aria-hidden="true">←</span>
                <span className="visually-hidden">Foto anterior</span>
              </button>
              <button type="button" className="icon-btn" onClick={() => go(1)}>
                <span aria-hidden="true">→</span>
                <span className="visually-hidden">Próxima foto</span>
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}
