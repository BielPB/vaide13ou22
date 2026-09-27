import type { Product, ProductId, ProductModel, StoreConfig } from '../config/types'

/** Endereço da página do produto. O slug vem das descrições (o mesmo da Yampi). */
export function productPath(product: Product, model: ProductModel): string {
  return `/produto/${model.about?.slug ?? `${product.id}-${model.id}`}`
}

/** Nome completo exibido fora do contexto do lado (ex.: "Boné Flávio Bolsonaro"). */
export function modelFullName(model: ProductModel): string {
  return model.category === 'camisa' ? model.name : `Boné ${model.name}`
}

export type Route =
  | { kind: 'home' }
  | { kind: 'product'; product: Product; model: ProductModel }
  | { kind: 'not-found' }

export function resolveRoute(config: StoreConfig, pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/') return { kind: 'home' }
  for (const id of ['13', '22'] as ProductId[]) {
    const product = config.products[id]
    const model = product.models.find((m) => productPath(product, m) === path)
    if (model) return { kind: 'product', product, model }
  }
  return { kind: 'not-found' }
}

/** Todas as páginas de produto (usado no build para gerar o HTML de cada uma). */
export function allProductPages(config: StoreConfig) {
  return (['13', '22'] as ProductId[]).flatMap((id) =>
    config.products[id].models.map((model) => ({ product: config.products[id], model, path: productPath(config.products[id], model) })),
  )
}
