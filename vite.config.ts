import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { storeConfig } from './src/config/store.ts'

/** Preenche título, descrição e metadados de compartilhamento a partir de src/config/store.ts. */
function storeMeta(): Plugin {
  const { store, status, shareImage } = storeConfig
  const title = store.name ? `13 ou 22? Bonés e camisas Lula 13 e Bolsonaro 22 | ${store.name}` : '13 ou 22? Bonés e camisas Lula 13 e Bolsonaro 22'
  const abs = (path: string) => (store.siteUrl ? new URL(path, store.siteUrl).href : path)
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

  return {
    name: 'store-meta',
    transformIndexHtml(html) {
      return html
        .replaceAll('%STORE_TITLE%', escape(title))
        .replaceAll('%SHARE_IMAGE%', escape(abs(shareImage)))
        .replace(
          '<!--%EXTRA_META%-->',
          [
            // Enquanto for prévia, a página não deve ser indexada por buscadores.
            status !== 'live' ? '<meta name="robots" content="noindex, nofollow" />' : '',
            store.siteUrl ? `<link rel="canonical" href="${escape(store.siteUrl)}" /><meta property="og:url" content="${escape(store.siteUrl)}" />` : '',
            store.name ? `<meta property="og:site_name" content="${escape(store.name)}" />` : '',
            // Pré-carrega as imagens do hero (as primeiras que o visitante vê).
            (() => {
              const d = storeConfig.defaultSelection
              const model = d && storeConfig.products[d.productId].models.find((m) => m.id === d.modelId)
              const variant = model?.variants.find((v) => v.id === d?.variantId)
              const src = variant?.image ?? model?.images[0]?.src
              return src ? `<link rel="preload" as="image" href="${escape(src)}" fetchpriority="high" />` : ''
            })(),
          ].join(''),
        )
    },
  }
}

export default defineConfig({
  plugins: [react(), storeMeta()],
})
