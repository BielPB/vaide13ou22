import { describe, expect, it } from 'vitest'
import { effectiveConfig } from '../config'
import { storeConfig } from '../config/store'
import type { ProductModel, StoreConfig } from '../config/types'
import { allPending, hasEssential, productPending } from './pending'
import {
  buildCheckoutUrl,
  CheckoutError,
  clampQuantity,
  lowestPriceCents,
  purchaseState,
  quantityRule,
  discountFromCompareAt,
  subtotalCents,
  unitPriceCents,
} from './purchase'

const specs = { material: 'M', closure: 'C', measurements: [['Aba', '7 cm']] as Array<[string, string]>, care: null, highlights: [] }
const img = (src: string) => ({ src, label: 'Foto', alt: 'foto', width: 450, height: 450, illustrative: false })

/**
 * Configuração completa SÓ PARA TESTE (domínio reservado .invalid).
 * Não é usada pela interface.
 */
function fullConfig(): StoreConfig {
  const m13: ProductModel = {
    id: 'classico',
    name: 'Clássico',
    description: null,
    priceCents: 4790,
    tiers: [{ minQuantity: 2, priceCents: 3990, percent: 16.7, coupon: 'TESTE2' }],
    images: [img('/produtos/13.webp')],
    specs,
    variants: [
      { id: 'p', label: 'Preto', stock: 3, available: true, image: null, checkoutUrl: 'https://seguro.loja.invalid/r/AABBJJ' },
      { id: 'g', label: 'Vermelho', stock: 20, available: true, image: null, checkoutUrl: 'https://seguro.loja.invalid/r/CCDDEE:1' },
      { id: 'z', label: 'Branco', stock: 0, available: true, image: null, checkoutUrl: 'https://seguro.loja.invalid/r/ZZZZZZ' },
    ],
  }
  const m22: ProductModel = {
    id: 'trucker',
    name: 'Trucker',
    description: null,
    priceCents: 3590,
    tiers: [
      { minQuantity: 2, priceCents: 2990, percent: 16.71, coupon: 'TRUCK2' },
      { minQuantity: 5, priceCents: 2490, percent: 30.64, coupon: 'TRUCK5' },
    ],
    images: [img('/produtos/22.webp')],
    specs,
    variants: [{ id: 'u', label: 'Azul', stock: 5, available: true, image: null, checkoutUrl: 'https://seguro.loja.invalid/r/XXYYZZ/' }],
  }
  return {
    ...storeConfig,
    status: 'live',
    store: {
      ...storeConfig.store,
      name: 'Teste',
      legalName: 'Teste LTDA',
      documentId: '00.000.000/0000-00',
      siteUrl: 'https://loja.invalid/',
      independence: { ...storeConfig.store.independence, confirmed: true },
    },
    contact: { ...storeConfig.contact, email: 'a@loja.invalid', hours: 'h' },
    commerce: { freeShippingAboveCents: 14990, freeShippingRegion: 'todo o Brasil', quantityDiscountActive: true, shipping: 's', dispatchTime: 'd', payments: ['Pix'], returns: 'r', tracking: 't', photosMatchProduct: true, fitGuide: null },
    policies: storeConfig.policies.map((p) => ({ ...p, body: 'texto' })),
    checkout: { kind: 'yampi', checkoutHost: 'seguro.loja.invalid', maxQuantity: 10 },
    products: {
      '13': { ...storeConfig.products['13'], models: [m13] },
      '22': { ...storeConfig.products['22'], models: [m22] },
    },
  }
}

const line = (productId: '13' | '22', modelId: string, variantId: string, quantity: number) => ({
  productId,
  modelId,
  variantId,
  quantity,
})

describe('configuração publicada (store.ts)', () => {
  it('loja publicada, sem pendência essencial: a compra está liberada', () => {
    expect(storeConfig.status).toBe('live')
    expect(allPending(storeConfig).filter((i) => i.level === 'essential')).toEqual([])
    const p22 = storeConfig.products['22']
    const flavio = p22.models.find((m) => m.id === 'flavio')!
    expect(purchaseState(storeConfig, p22, flavio, flavio.variants[0]!)).toEqual({ canBuy: true, block: null })
    // ainda pede modelo e cor antes
    expect(purchaseState(storeConfig, storeConfig.products['13'], null, null).block).toBe('model-not-chosen')
  })

  it('tem os 5 bonés e a camisa do 13 com os preços definidos, sem 2+', () => {
    const models = storeConfig.products['13'].models
    expect(Object.fromEntries(models.map((m) => [m.id, m.priceCents]))).toEqual({
      'nome-lula-estrela': 4590,
      'numero-13': 3990,
      'nome-lula-letras': 4590,
      simples: 3990,
      'trucker-liso': 3990,
      camisa: 4990,
    })
    expect(models.every((m) => m.tiers.length === 0)).toBe(true)
  })

  it('modelo sem preço bloqueia com "preço a confirmar"', () => {
    const p13 = storeConfig.products['13']
    const semPreco = { ...p13.models[0]!, priceCents: null }
    expect(purchaseState(storeConfig, p13, semPreco, semPreco.variants[0]!).block).toBe('price-missing')
  })

  it('tem os 4 bonés e a camisa do 22 com os preços informados pelo vendedor, sem 2+', () => {
    const models = storeConfig.products['22'].models
    expect(Object.fromEntries(models.map((m) => [m.id, m.priceCents]))).toEqual({
      'nome-bandeira': 4790,
      simples: 3590,
      camuflado: 5990,
      flavio: 3790,
      camisa: 4990,
    })
    expect(models.every((m) => m.tiers.length === 0)).toBe(true)
  })

  it('cada cor aponta para uma foto existente do próprio modelo', () => {
    for (const m of [...storeConfig.products['13'].models, ...storeConfig.products['22'].models]) {
      for (const v of m.variants) if (v.image !== null) expect(m.images.map((i) => i.src)).toContain(v.image)
    }
  })

  it('toda cor tem um Link de compra da Yampi, sem repetição', () => {
    const urls = [...storeConfig.products['13'].models, ...storeConfig.products['22'].models].flatMap((m) =>
      m.variants.map((v) => v.checkoutUrl),
    )
    expect(urls).toHaveLength(63)
    expect(urls.every((u) => /^https:\/\/seguro\.asadeltastore\.com\/r\/[A-Z0-9]{10}$/.test(u ?? ''))).toBe(true)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('links conferidos no checkout: cor certa no lugar certo', () => {
    const url = (pid: '13' | '22', mid: string, vid: string) =>
      storeConfig.products[pid].models.find((m) => m.id === mid)!.variants.find((v) => v.id === vid)!.checkoutUrl
    expect(url('13', 'numero-13', 'vermelho')).toMatch(/KXCGAPO8S5$/)
    expect(url('13', 'nome-lula-estrela', 'branco-preto')).toMatch(/CIQUQ75E6W$/)
    expect(url('13', 'trucker-liso', 'preto')).toMatch(/MPXPL35PB7$/)
    expect(url('22', 'camuflado', 'cinza')).toMatch(/CLFY0H6VJ4$/)
    expect(url('22', 'flavio', 'verde')).toMatch(/RP2EC3WKXI$/)
    // camisas: cor × tamanho
    expect(url('13', 'camisa', 'branca-p')).toMatch(/KCY1XHMG4A$/)
    expect(url('13', 'camisa', 'marrom-escuro-gg')).toMatch(/3CRJV5MPTJ$/)
    expect(url('13', 'camisa', 'vermelha-gg')).toMatch(/JIH6RHVQ1U$/)
    expect(url('22', 'camisa', 'branca-p')).toMatch(/TQXD4SZV8E$/)
    expect(url('22', 'camisa', 'preta-gg')).toMatch(/4BDV8LLHFA$/)
  })

  it('o botão gera o Link de compra real da Yampi, com a quantidade', () => {
    expect(buildCheckoutUrl(storeConfig, [line('13', 'numero-13', 'vermelho', 1)])).toBe(
      'https://seguro.asadeltastore.com/r/KXCGAPO8S5:1',
    )
    expect(buildCheckoutUrl(storeConfig, [line('22', 'camisa', 'preta-m', 2)])).toBe(
      'https://seguro.asadeltastore.com/r/6P7W0GJ3OB:2',
    )
  })

  it('em prévia, mesmo com links, a compra fica bloqueada', () => {
    const preview = { ...storeConfig, status: 'preview' as const }
    const p = preview.products['13']
    const m = p.models.find((x) => x.id === 'numero-13')!
    expect(purchaseState(preview, p, m, m.variants[0]!).block).toBe('preview')
    expect(() => buildCheckoutUrl(preview, [line('13', 'numero-13', 'vermelho', 1)])).toThrow(CheckoutError)
  })

  it('preço anterior real só nos modelos informados, com % arredondada para baixo', () => {
    // Chave lado/modelo: "simples" e "camisa" existem nos dois lados.
    const all = (['13', '22'] as const).flatMap((side) => storeConfig.products[side].models.map((m) => ({ key: `${side}/${m.id}`, m })))
    const withWas = Object.fromEntries(
      all.filter(({ m }) => m.compareAtCents).map(({ key, m }) => [key, [m.compareAtCents, discountFromCompareAt(m)!.percent]]),
    )
    expect(withWas).toEqual({
      '13/nome-lula-estrela': [5490, 16],
      '13/numero-13': [4590, 13],
      '13/nome-lula-letras': [5490, 16],
      '13/simples': [4990, 20],
      '13/trucker-liso': [4990, 20],
      '13/camisa': [7990, 37],
      '22/nome-bandeira': [5990, 20],
      '22/simples': [4990, 28],
      '22/camuflado': [7990, 25],
      '22/flavio': [4990, 24],
      '22/camisa': [7990, 37],
    })
    expect(all.filter(({ m }) => m.compareAtCents).every(({ m }) => !!m.compareAtSource)).toBe(true)
  })

  it('sem faixas: subtotal = preço × quantidade (o que a Yampi cobra: 2 Número 13 = R$ 79,80)', () => {
    const n13 = storeConfig.products['13'].models.find((x) => x.id === 'numero-13')!
    expect(unitPriceCents(n13, 2)).toBe(3990)
    expect(subtotalCents(n13, 2)).toBe(7980)
  })

  it('não contém avaliações sem verificação', () => {
    expect(storeConfig.reviews.every((r) => r.verified)).toBe(true)
  })
})

describe('catálogo real com a loja publicada (simulação)', () => {
  // Preenche só o que falta para publicar; links e preços são os reais de store.ts.
  function publicada(): StoreConfig {
    const c = structuredClone(storeConfig)
    c.status = 'live'
    c.store = { ...c.store, legalName: 'X', documentId: 'Y', independence: { ...c.store.independence, confirmed: true }, siteUrl: 'https://loja.invalid/' }
    c.commerce = { ...c.commerce, shipping: 's', payments: ['Pix'], returns: 'r' }
    c.policies = c.policies.map((p) => ({ ...p, body: 'texto' }))
    for (const p of [c.products['13'], c.products['22']])
      for (const m of p.models) m.specs = { material: 'M', closure: 'C', measurements: [['Tamanho', 'Único']], care: null, highlights: [] }
    return effectiveConfig(c)
  }

  it('2 Número 13 → link sem cupom, com :2', () => {
    expect(buildCheckoutUrl(publicada(), [line('13', 'numero-13', 'vermelho', 2)])).toBe(
      'https://seguro.asadeltastore.com/r/KXCGAPO8S5:2',
    )
  })

  it('1 Número 13 vermelho → link da Yampi com :1', () => {
    expect(buildCheckoutUrl(publicada(), [line('13', 'numero-13', 'vermelho', 1)])).toBe(
      'https://seguro.asadeltastore.com/r/KXCGAPO8S5:1',
    )
  })

  it('3 Flávio azul → :3', () => {
    expect(buildCheckoutUrl(publicada(), [line('22', 'flavio', 'azul', 3)])).toBe(
      'https://seguro.asadeltastore.com/r/T3L4M32HER:3',
    )
  })

  it('Camuflado cinza (sem foto) também compra', () => {
    const c = publicada()
    const p = c.products['22']
    const m = p.models.find((x) => x.id === 'camuflado')!
    expect(purchaseState(c, p, m, m.variants.find((v) => v.id === 'cinza')!).canBuy).toBe(true)
  })
})

describe('preço progressivo', () => {
  const cfg = fullConfig()
  const m13 = cfg.products['13'].models[0]!
  const m22 = cfg.products['22'].models[0]!

  it('1 unidade usa o preço cheio; 2 ou mais usam o preço da faixa', () => {
    expect(unitPriceCents(m13, 1)).toBe(4790)
    expect(unitPriceCents(m13, 2)).toBe(3990)
    expect(unitPriceCents(m13, 7)).toBe(3990)
  })

  it('escolhe a maior faixa atingida', () => {
    expect(unitPriceCents(m22, 4)).toBe(2990)
    expect(unitPriceCents(m22, 5)).toBe(2490)
  })

  it('com faixa em %: subtotal = preço cheio × qtd − % (como a Yampi calcularia)', () => {
    const m = fullConfig().products['13'].models[0]!
    expect(subtotalCents(m, 1)).toBe(4790)
    expect(subtotalCents(m, 2)).toBe(Math.round(9580 * (1 - 0.167)))
  })

  it('"a partir de" usa o menor preço de 1 unidade entre os modelos', () => {
    expect(lowestPriceCents(storeConfig.products['22'])).toBe(3590)
    expect(lowestPriceCents(storeConfig.products['13'])).toBe(3990)
    expect(lowestPriceCents({ ...storeConfig.products['13'], models: [] })).toBeNull()
  })
})

describe('quantidade', () => {
  const cfg = fullConfig()
  const m13 = cfg.products['13'].models[0]!

  it('limita ao menor entre estoque e máximo do checkout', () => {
    expect(quantityRule(cfg, m13.variants[0]!).max).toBe(3)
    expect(quantityRule(cfg, m13.variants[1]!).max).toBe(10)
    expect(clampQuantity(9, quantityRule(cfg, m13.variants[0]!))).toBe(3)
    expect(clampQuantity(0, quantityRule(cfg, m13.variants[0]!))).toBe(1)
    expect(clampQuantity(Number.NaN, quantityRule(cfg, m13.variants[0]!))).toBe(1)
    expect(clampQuantity(2.7, quantityRule(cfg, m13.variants[1]!))).toBe(2)
  })

  it('fixa em 1 unidade quando um checkout genérico não aceita quantidade', () => {
    const fixed: StoreConfig = { ...cfg, checkout: { kind: 'link', providerName: 'X', quantity: { mode: 'fixed-one' } } }
    expect(quantityRule(fixed, m13.variants[1]!)).toMatchObject({ max: 1, fixed: true })
  })
})

describe('estado de compra', () => {
  const cfg = fullConfig()
  const p13 = cfg.products['13']
  const m13 = p13.models[0]!

  it('libera com loja publicada, dados completos e cor em estoque', () => {
    expect(hasEssential(allPending(cfg))).toBe(false)
    expect(purchaseState(cfg, p13, m13, m13.variants[0]!)).toEqual({ canBuy: true, block: null })
  })

  it('pede modelo e depois cor', () => {
    expect(purchaseState(cfg, p13, null, null).block).toBe('model-not-chosen')
    expect(purchaseState(cfg, p13, m13, null).block).toBe('variant-not-chosen')
  })

  it('bloqueia cor esgotada', () => {
    expect(purchaseState(cfg, p13, m13, m13.variants[2]!).block).toBe('out-of-stock')
  })

  it('bloqueia em modo prévia mesmo com dados completos', () => {
    expect(purchaseState({ ...cfg, status: 'preview' }, p13, m13, m13.variants[0]!).block).toBe('preview')
  })

  it('bloqueia cor sem Link de compra', () => {
    const v = { ...m13.variants[0]!, checkoutUrl: null }
    expect(purchaseState(cfg, p13, { ...m13, variants: [v] }, v).block).toBe('checkout-missing')
  })

  it('pendência de um modelo não bloqueia os outros', () => {
    const c = structuredClone(cfg)
    const incompleto: ProductModel = { ...structuredClone(m13), id: 'novo', images: [] }
    c.products['13'].models.push(incompleto)
    const p = c.products['13']
    expect(purchaseState(c, p, p.models[0]!, p.models[0]!.variants[0]!).canBuy).toBe(true)
    expect(purchaseState(c, p, incompleto, incompleto.variants[0]!).block).toBe('product-incomplete')
    expect(productPending(p, c).some((i) => i.key === 'FOTOS_REAIS_13' && i.level === 'essential')).toBe(true)
  })
})

describe('checkout Yampi', () => {
  it('monta /r/TOKEN:QUANTIDADE a partir do Link de compra da cor', () => {
    const cfg = fullConfig()
    expect(buildCheckoutUrl(cfg, [line('13', 'classico', 'p', 1)])).toBe('https://seguro.loja.invalid/r/AABBJJ:1')
    expect(buildCheckoutUrl(cfg, [line('13', 'classico', 'p', 2)])).toBe('https://seguro.loja.invalid/r/AABBJJ:2?promocode=TESTE2')
    expect(buildCheckoutUrl(cfg, [line('13', 'classico', 'g', 3)])).toBe('https://seguro.loja.invalid/r/CCDDEE:3?promocode=TESTE2')
    expect(buildCheckoutUrl(cfg, [line('22', 'trucker', 'u', 1)])).toBe('https://seguro.loja.invalid/r/XXYYZZ:1')
  })

  it('aceita os dois lados no mesmo pedido (base para o carrinho)', () => {
    const cfg = fullConfig()
    // dois cupons diferentes não cabem num pedido: vai sem cupom
    expect(buildCheckoutUrl(cfg, [line('13', 'classico', 'p', 1), line('22', 'trucker', 'u', 2)])).toBe(
      'https://seguro.loja.invalid/r/AABBJJ:1,XXYYZZ:2?promocode=TRUCK2',
    )
    expect(buildCheckoutUrl(cfg, [line('13', 'classico', 'p', 2), line('22', 'trucker', 'u', 2)])).toBe(
      'https://seguro.loja.invalid/r/AABBJJ:2,XXYYZZ:2',
    )
  })

  it('recusa quantidade acima do estoque ou do máximo', () => {
    const cfg = fullConfig()
    expect(() => buildCheckoutUrl(cfg, [line('13', 'classico', 'p', 4)])).toThrow(/Máximo: 3/)
    expect(() => buildCheckoutUrl(cfg, [line('13', 'classico', 'g', 11)])).toThrow(/Máximo: 10/)
  })

  it('recusa cor esgotada, modelo ou cor inexistente', () => {
    const cfg = fullConfig()
    expect(() => buildCheckoutUrl(cfg, [line('13', 'classico', 'z', 1)])).toThrow(/esgotada/)
    expect(() => buildCheckoutUrl(cfg, [line('13', 'nao-existe', 'p', 1)])).toThrow(/Modelo não encontrado/)
    expect(() => buildCheckoutUrl(cfg, [line('13', 'classico', 'nao-existe', 1)])).toThrow(/não encontrada/)
  })

  it('recusa link inválido, sem HTTPS, de outro domínio ou fora do formato /r/TOKEN', () => {
    const cfg = fullConfig()
    const v = cfg.products['22'].models[0]!.variants[0]!
    const go = () => buildCheckoutUrl(cfg, [line('22', 'trucker', 'u', 1)])
    v.checkoutUrl = 'nao é url'
    expect(go).toThrow(/inválido/)
    v.checkoutUrl = 'http://seguro.loja.invalid/r/XXYYZZ'
    expect(go).toThrow(/HTTPS/)
    v.checkoutUrl = 'https://outro.invalid/r/XXYYZZ'
    expect(go).toThrow(/checkout configurado/)
    v.checkoutUrl = 'https://seguro.loja.invalid/produto/bone-22'
    expect(go).toThrow(/Link de compra da Yampi/)
  })

  it('sem domínio configurado, a compra fica bloqueada', () => {
    const cfg = fullConfig()
    cfg.checkout = { kind: 'yampi', checkoutHost: null, maxQuantity: 5 }
    const p = cfg.products['13']
    expect(purchaseState(cfg, p, p.models[0]!, p.models[0]!.variants[0]!).block).toBe('checkout-missing')
  })

  it('checkout genérico: um item só, quantidade só no modo param', () => {
    const cfg: StoreConfig = { ...fullConfig(), checkout: { kind: 'link', providerName: 'X', quantity: { mode: 'fixed-one' } } }
    expect(buildCheckoutUrl(cfg, [line('13', 'classico', 'p', 1)])).toBe('https://seguro.loja.invalid/r/AABBJJ')
    expect(() => buildCheckoutUrl(cfg, [line('13', 'classico', 'p', 1), line('22', 'trucker', 'u', 1)])).toThrow(/mais de um modelo/)
    const withParam: StoreConfig = { ...cfg, checkout: { kind: 'link', providerName: 'X', quantity: { mode: 'param', param: 'qty', max: 5 } } }
    expect(buildCheckoutUrl(withParam, [line('13', 'classico', 'g', 2)])).toBe('https://seguro.loja.invalid/r/CCDDEE:1?qty=2')
  })
})
