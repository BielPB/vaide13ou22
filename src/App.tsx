import { useEffect } from 'react'
import type { DefaultSelection, Product, ProductModel, StoreConfig } from './config/types'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { CustomerPhotos, HeroBanner, Intro, Showcase } from './components/Home'
import { Guarantee, ProductInfo } from './components/ModelSections'
import { ProductPage } from './components/ProductPage'
import { Reviews } from './components/Reviews'
import { StickyPurchaseBar } from './components/StickyPurchaseBar'
import { formatBRL } from './lib/format'
import { hasEssential, modelPending, storePending } from './lib/pending'
import { Link, usePathname } from './lib/router'
import { modelFullName, productPath, resolveRoute, type Route } from './lib/routes'
import { ShopProvider, useShop } from './lib/shop'
import { CartProvider } from './lib/cartContext'
import { CartDrawer } from './components/Cart'
import { startMetaPixel } from './lib/metaPixel'

/**
 * Dados estruturados do produto da página — só com loja publicada, URL
 * definida, preço confirmado e foto real. Nada é inventado.
 */
function ProductJsonLd({ product, model }: { product: Product; model: ProductModel }) {
  const { config } = useShop()
  const { store } = config
  if (config.status !== 'live' || !store.siteUrl || !store.name || hasEssential(storePending(config))) return null
  if (hasEssential(modelPending(product, model, config))) return null

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: modelFullName(model),
    image: model.images.filter((img) => img.src && !img.illustrative).map((img) => new URL(img.src!, store.siteUrl!).href),
    ...(model.specs.material ? { material: model.specs.material } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: (model.priceCents! / 100).toFixed(2),
      availability: model.variants.some((v) => v.available && v.stock !== 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: new URL(productPath(product, model), store.siteUrl).href,
      seller: { '@type': 'Organization', name: store.name },
    },
  }
  return <script type="application/ld+json">{JSON.stringify(data)}</script>
}

/** Descrição geral da loja (a do index.html), restaurada fora das páginas de produto. */
let defaultDescription: string | null = null

/** Título e descrição da aba de acordo com a página. */
function usePageMeta(config: StoreConfig, route: Route, pathname: string) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]')
    defaultDescription ??= meta?.getAttribute('content') ?? null
    const brand = config.store.name ?? '13 ou 22'
    let title = `${brand} | Bonés e camisas 13 e 22`
    let description: string | null = null
    if (route.kind === 'product') {
      const { model } = route
      title = `${modelFullName(model)} | ${brand}`
      description = `${modelFullName(model)}${model.priceCents !== null ? ` por ${formatBRL(model.priceCents)}` : ''}. ${model.description ?? ''}`.trim()
    } else if (route.kind === 'not-found') {
      title = `Página não encontrada | ${brand}`
    }
    document.title = title
    const content = description ?? defaultDescription
    if (content) meta?.setAttribute('content', content)
    // A rota é derivada do endereço: basta reagir a ele.
  }, [config, pathname])
}

/** Na página de produto, abre na cor da primeira foto (bonés). Camisa espera a escolha de cor e tamanho. */
function initialFor(route: Route): DefaultSelection | null {
  if (route.kind !== 'product') return null
  const { product, model } = route
  const first = model.images.find((img) => img.src)?.src
  const variant = model.category === 'camisa' ? undefined : model.variants.find((v) => v.image === first)
  return { productId: product.id, modelId: model.id, variantId: variant?.id }
}

function HomePage() {
  return (
    <>
      <HeroBanner />
      <Intro />
      <CustomerPhotos />
      <Showcase side="13" />
      <Showcase side="22" />
      <FAQ />
    </>
  )
}

function ProductRoute({ product, model }: { product: Product; model: ProductModel }) {
  return (
    <>
      <ProductPage />
      <Guarantee />
      <ProductInfo />
      {/* Avaliações sempre logo abaixo de "Sobre o produto". */}
      <Reviews />
      <Showcase side={product.id} exclude={model.id} title={`Mais modelos de ${product.name}`} />
      <ProductJsonLd product={product} model={model} />
    </>
  )
}

function NotFound() {
  return (
    <>
      <section className="section not-found">
        <div className="container">
          <h1 className="section__title">Página não encontrada</h1>
          <p className="not-found__text">O endereço pode ter mudado. Veja os modelos abaixo ou volte para o início.</p>
          <Link className="btn btn--outline" href="/">
            Ir para o início
          </Link>
        </div>
      </section>
      <Showcase side="13" />
      <Showcase side="22" />
    </>
  )
}

export function App({ config }: { config: StoreConfig }) {
  const pathname = usePathname()
  const route = resolveRoute(config, pathname)
  usePageMeta(config, route, pathname)
  // Meta Pixel (só com VITE_META_PIXEL_ID configurado): as trocas de página seguintes o próprio pixel registra.
  useEffect(() => startMetaPixel(), [])
  const page = route.kind === 'home' ? 'home' : route.kind === 'product' ? 'product' : 'other'

  return (
    // O carrinho fica acima da página e não zera ao navegar.
    <CartProvider config={config}>
      {/* Cada página começa do zero (cor, tamanho e quantidade da página anterior não passam adiante). */}
      <ShopProvider key={pathname} config={config} initial={initialFor(route)}>
        <a className="skip-link" href={route.kind === 'product' ? '#comprar' : '#conteudo'}>
          {route.kind === 'product' ? 'Pular para a compra' : 'Pular para o conteúdo'}
        </a>
        <Header page={page} />
        <main id="conteudo" tabIndex={-1}>
          {route.kind === 'home' && <HomePage />}
          {route.kind === 'product' && <ProductRoute product={route.product} model={route.model} />}
          {route.kind === 'not-found' && <NotFound />}
        </main>
        <Footer showFaq={route.kind === 'home'} />
        <StickyPurchaseBar />
        <CartDrawer />
      </ShopProvider>
    </CartProvider>
  )
}
