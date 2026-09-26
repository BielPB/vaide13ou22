import type { StoreConfig } from './config/types'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { HeroBanner, Intro, Showcase } from './components/Home'
import { Guarantee, ProductInfo } from './components/ModelSections'
import { ProductPage } from './components/ProductPage'
import { Reviews } from './components/Reviews'
import { StickyPurchaseBar } from './components/StickyPurchaseBar'
import { hasEssential, modelPending, storePending } from './lib/pending'
import { ShopProvider, useShop } from './lib/shop'

/**
 * Dados estruturados de produto — só são emitidos com loja publicada, URL
 * definida, preço confirmado e foto real. Nada é inventado.
 */
function ProductJsonLd() {
  const { config } = useShop()
  const { store } = config
  if (config.status !== 'live' || !store.siteUrl || !store.name || hasEssential(storePending(config))) return null

  const data = Object.values(config.products).flatMap((p) =>
    p.models
      .filter((m) => !hasEssential(modelPending(p, m, config)))
      .map((m) => ({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${p.name} — ${m.name}`,
        image: m.images.filter((img) => img.src && !img.illustrative).map((img) => new URL(img.src!, store.siteUrl!).href),
        ...(m.specs.material ? { material: m.specs.material } : {}),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: (m.priceCents! / 100).toFixed(2),
          availability: m.variants.some((v) => v.available && v.stock !== 0)
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: `${store.siteUrl}#modelos`,
          seller: { '@type': 'Organization', name: store.name },
        },
      })),
  )
  if (data.length === 0) return null

  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}

export function App({ config }: { config: StoreConfig }) {
  return (
    <ShopProvider config={config}>
      <a className="skip-link" href="#comprar">
        Pular para o produto
      </a>
      <Header />
      <main>
        <HeroBanner />
        <Intro />
        <Showcase side="13" />
        <Showcase side="22" />
        <ProductPage />
        <Guarantee />
        <ProductInfo />
        <Reviews />
        <FAQ />
      </main>
      <Footer />
      <StickyPurchaseBar />
      <ProductJsonLd />
    </ShopProvider>
  )
}
