import { describe, expect, it } from 'vitest'
import { storeConfig } from '../config/store'
import type { StoreConfig } from '../config/types'
import { activeProducts, isProductActive } from './catalog'
import { allPending } from './pending'
import { allProductPages, productPath, resolveRoute } from './routes'

/** Fotos que existem em public/produtos/alfaiataria (caminho como o site usa: /produtos/...). */
const fotosNoSite = new Set(Object.keys(import.meta.glob('/public/produtos/alfaiataria/**/*.webp')).map((k) => k.replace(/^\/public/, '')))

const ligada = (): StoreConfig => ({
  ...storeConfig,
  products: { ...storeConfig.products, alfaiataria: { ...storeConfig.products.alfaiataria, enabled: true } },
})

describe('seção Alfaiataria', () => {
  const alf = storeConfig.products.alfaiataria

  it('está desligada: fora das vitrines, rotas, páginas do build e pendências', () => {
    expect(isProductActive(storeConfig, 'alfaiataria')).toBe(false)
    expect(activeProducts(storeConfig).map((p) => p.id)).toEqual(['13', '22'])
    expect(allProductPages(storeConfig).some((p) => p.product.id === 'alfaiataria')).toBe(false)
    expect(resolveRoute(storeConfig, productPath(alf, alf.models[0]!)).kind).toBe('not-found')
    expect(allPending(storeConfig).some((i) => i.productId === 'alfaiataria')).toBe(false)
  })

  it('ligada, cada peça ganha sua página', () => {
    const c = ligada()
    const pages = allProductPages(c).filter((p) => p.product.id === 'alfaiataria')
    expect(pages).toHaveLength(11)
    const route = resolveRoute(c, pages[0]!.path)
    expect(route.kind === 'product' && route.product.id === 'alfaiataria').toBe(true)
    // Sem os Links de compra, ela apareceria como pendente (por isso segue desligada).
    expect(allPending(c).some((i) => i.productId === 'alfaiataria' && i.level === 'essential')).toBe(true)
  })

  it('11 peças em português, sem o tênis, com descrição, fotos no site e preço com origem', () => {
    expect(alf.models).toHaveLength(11)
    expect(alf.models.some((m) => /zapatilla|mailson|t[eê]nis/i.test(`${m.id} ${m.name}`))).toBe(false)
    for (const m of alf.models) {
      expect(m.about?.slug, m.id).toBeTruthy()
      expect(m.priceCents, m.id).toBeGreaterThan(0)
      expect(m.compareAtCents! > m.priceCents!, m.id).toBe(true)
      expect(m.compareAtSource, m.id).toBeTruthy()
      expect(/pantal|zapat|punto|sastre|acanalad/i.test(m.name), m.name).toBe(false)
      for (const src of [...m.images.map((i) => i.src), ...m.variants.map((v) => v.image)]) {
        expect(fotosNoSite.has(src ?? ''), src ?? '').toBe(true)
      }
    }
    const slugs = alf.models.map((m) => m.about!.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
