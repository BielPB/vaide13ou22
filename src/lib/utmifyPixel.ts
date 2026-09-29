/**
 * Pixel da UTMify (instalado a pedido do vendedor em 28/09/2026).
 *
 * É a versão legível do trecho que a UTMify entrega ofuscado: define
 * `window.pixelId` e carrega https://cdn.utmify.com.br/scripts/pixel/pixel.js.
 * O ID vem da variável de ambiente VITE_UTMIFY_PIXEL_ID (Vercel), nunca do
 * código: o repositório é público. Sem o ID, nada é carregado.
 *
 * O script da UTMify registra visitas, cliques em "Adicionar"/"Comprar" e o
 * início do checkout, com o título e o endereço da página, e repassa esses
 * eventos aos pixels (Meta/TikTok) cadastrados na conta da UTMify. As políticas
 * de privacidade e de cookies descrevem esse uso.
 */
declare global {
  interface Window {
    pixelId?: string
  }
}

const PIXEL_ID = (import.meta.env.VITE_UTMIFY_PIXEL_ID ?? '').trim()

export const utmifyPixelEnabled = /^[a-f0-9]{24}$/i.test(PIXEL_ID)

const SRC = 'https://cdn.utmify.com.br/scripts/pixel/pixel.js'

/** Carrega o pixel da UTMify uma vez (chamado ao abrir o site). */
export function startUtmifyPixel() {
  if (!utmifyPixelEnabled || typeof document === 'undefined') return
  if (document.querySelector(`script[src="${SRC}"]`)) return
  window.pixelId = PIXEL_ID
  const script = document.createElement('script')
  script.src = SRC
  script.async = true
  script.defer = true
  document.head.appendChild(script)
}
