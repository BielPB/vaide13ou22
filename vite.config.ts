import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { storeConfig } from './src/config/store.ts'
import { allProductPages, modelFullName } from './src/lib/routes.ts'

const { store, status, shareImage, banner, commerce } = storeConfig
const brand = store.name ?? '13 ou 22'
const abs = (path: string) => (store.siteUrl ? new URL(path, store.siteUrl).href : path)
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const formatBRL = (cents: number) => brl.format(cents / 100)
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Preenche título, descrição e metadados de compartilhamento a partir de src/config/store.ts. */
function storeMeta(): Plugin {
  const title = `Vai de 13 ou 22? Bonés e camisas | ${brand}`
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
            // Pré-carrega o banner (a primeira imagem da página inicial), na versão de cada tela.
            banner
              ? `<link rel="preload" as="image" href="${escape(banner.src)}" media="(min-width: 700px)" fetchpriority="high" />` +
                (banner.mobileSrc ? `<link rel="preload" as="image" href="${escape(banner.mobileSrc)}" media="(max-width: 699px)" fetchpriority="high" />` : '')
              : '',
          ].join(''),
        )
    },
  }
}

/**
 * No build, grava um HTML para cada produto (dist/produto/<slug>/index.html) com
 * título, descrição e foto próprios. Quem lê o link sem rodar JavaScript
 * (prévia do WhatsApp, redes sociais, buscadores) vê o produto certo.
 */
function productPages(): Plugin {
  let outDir = 'dist'
  return {
    name: 'product-pages',
    apply: 'build',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir)
    },
    closeBundle() {
      const base = readFileSync(join(outDir, 'index.html'), 'utf8')
      for (const { model, path } of allProductPages(storeConfig)) {
        const name = modelFullName(model)
        const title = `${name} | ${brand}`
        const price = model.priceCents !== null ? ` por ${formatBRL(model.priceCents)}` : ''
        const free = commerce.freeShippingAboveCents !== null ? ` Frete grátis acima de ${formatBRL(commerce.freeShippingAboveCents)}.` : ''
        const description = `${name}${price}. ${model.description ?? ''}${free}`.replace(/\s+/g, ' ').trim()
        const image = model.images.find((img) => img.src)?.src ?? shareImage
        const url = store.siteUrl ? new URL(path, store.siteUrl).href : null
        const html = base
          .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
          .replace(/(<meta name="description" content=")[^"]*/, `$1${escape(description)}`)
          .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(title)}`)
          .replace(/(<meta property="og:description" content=")[^"]*/, `$1${escape(description)}`)
          .replace(/(<meta property="og:image" content=")[^"]*/, `$1${escape(abs(image))}`)
          .replace(/(<meta property="og:image:alt" content=")[^"]*/, `$1${escape(model.images[0]?.alt ?? name)}`)
          .replace(/<meta property="og:image:(width|height)"[^>]*>/g, '')
          // O banner da página inicial não é usado aqui: pré-carrega a foto do produto.
          .replace(/<link rel="preload" as="image"[^>]*>/g, '')
          .replace('</head>', `<link rel="preload" as="image" href="${escape(image)}" fetchpriority="high" /></head>`)
          .replace(/<link rel="canonical" href="[^"]*" \/><meta property="og:url" content="[^"]*" \/>/, url ? `<link rel="canonical" href="${escape(url)}" /><meta property="og:url" content="${escape(url)}" />` : '')
        const file = join(outDir, path, 'index.html')
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, html)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), storeMeta(), productPages()],
})
