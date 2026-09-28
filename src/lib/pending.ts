import type { Product, ProductId, ProductModel, StoreConfig } from '../config/types'
import { checkoutConfigured, isVariantInStock } from './purchase'

export interface PendingItem {
  /** Chave do briefing (ex.: PRECO_BONE_13). */
  key: string
  label: string
  /** `essential` bloqueia a venda; `recommended` não bloqueia, mas deve ser resolvido. */
  level: 'essential' | 'recommended'
  productId?: ProductId
}

/** Pendências de um modelo. Só elas bloqueiam a venda desse modelo. */
export function modelPending(p: Product, m: ProductModel, config: StoreConfig): PendingItem[] {
  const items: PendingItem[] = []
  const add = (key: string, label: string, level: PendingItem['level'] = 'essential') =>
    items.push({ key: `${key}_${p.id}`, label: `${label} — ${p.name} / ${m.name}`, level, productId: p.id })

  if (m.priceCents === null) add('PRECO_BONE', 'Preço')
  if (m.variants.length === 0) add('VARIANTES', 'Cores/opções')
  if (m.variants.some((v) => v.stock === null)) add('ESTOQUE', 'Estoque por cor', 'recommended')
  if (!m.images.some((img) => img.src !== null && !img.illustrative)) add('FOTOS_REAIS', 'Foto real')
  // Ficha técnica: recomendada, não bloqueia a venda (decisão do vendedor em 26/09/2026).
  // Na loja publicada, campo sem dado simplesmente não aparece — nada é inventado.
  if (m.specs.material === null) add('MATERIAL', 'Material', 'recommended')
  if (m.specs.measurements === null) add('MEDIDAS', m.category === 'camisa' ? 'Tabela de medidas por tamanho' : 'Medidas', 'recommended')
  else if (m.category === 'camisa' && /referência/i.test(m.specs.measurementsNote ?? '')) {
    add('MEDIDAS', 'Conferir a tabela de referência medindo uma peça de cada tamanho', 'recommended')
  }
  if (m.specs.closure === null && m.category !== 'camisa') add('FECHAMENTO', 'Fechamento/ajuste', 'recommended')
  // Cor esgotada não precisa de Link de compra (não é vendida).
  if (!checkoutConfigured(config) || m.variants.some((v) => isVariantInStock(v) && v.checkoutUrl === null)) {
    add('CHECKOUT_POR_PRODUTO_OU_VARIANTE', 'Link de compra (Yampi) de cada cor')
  }
  return items
}

export function productPending(p: Product, config: StoreConfig): PendingItem[] {
  if (p.models.length === 0) {
    return [
      { key: `VARIANTES_${p.id}`, label: `Modelos, cores, preços e fotos — ${p.name}`, level: 'essential', productId: p.id },
    ]
  }
  return p.models.flatMap((m) => modelPending(p, m, config))
}

export function storePending(config: StoreConfig): PendingItem[] {
  const items: PendingItem[] = []
  const add = (key: string, label: string, level: PendingItem['level'] = 'essential') =>
    items.push({ key, label, level })
  const { store, contact, commerce } = config

  if (store.name === null) add('NOME_DA_LOJA', 'Nome da loja')
  if (store.legalName === null || store.documentId === null) {
    // Decisão do vendedor: não exibir. Mantido como aviso (Decreto 7.962/2013, art. 2º).
    add('IDENTIFICACAO_DO_VENDEDOR', 'Nome/razão social, CPF/CNPJ e endereço não informados no site (decisão do vendedor; ver aviso legal)', 'recommended')
  }
  if (!store.independence.confirmed) {
    add('IDENTIFICACAO_DO_VENDEDOR', 'Confirmar declaração de loja independente')
  }
  if (!contact.whatsapp && !contact.email && !contact.phone) add('CONTATO', 'Telefone, WhatsApp ou e-mail de atendimento')
  if (!contact.hours) add('CONTATO', 'Horário de atendimento', 'recommended')
  if (commerce.shipping === null) add('CONDICOES_DE_FRETE', 'Condições de frete e área de entrega')
  if (commerce.dispatchTime === null) add('CONDICOES_DE_FRETE', 'Prazo de postagem', 'recommended')
  if (commerce.payments === null) add('PAGAMENTOS', 'Formas de pagamento aceitas no checkout')
  if (commerce.returns === null) add('POLITICAS', 'Resumo de trocas e devoluções')
  if (commerce.tracking === null) add('POLITICAS', 'Como acompanhar o pedido', 'recommended')
  if (commerce.photosMatchProduct === null) add('FOTOS_REAIS', 'Confirmar que as fotos são do produto vendido')
  for (const policy of config.policies) {
    if (policy.body === null) add('POLITICAS', `Política: ${policy.title}`)
  }
  const hasTiers = [config.products['13'], config.products['22']].some((p) => p.models.some((m) => m.tiers.length > 0))
  if (hasTiers && !commerce.quantityDiscountActive) {
    add('DESCONTO_PROGRESSIVO', 'Configurar o desconto de 2+ na Yampi e ativar quantityDiscountActive (até lá, o site não mostra o preço de 2+)', 'recommended')
  }
  if (store.siteUrl === null) add('URL_DO_SITE', 'Endereço final do site (canonical e compartilhamento)', 'recommended')
  return items
}

export function allPending(config: StoreConfig): PendingItem[] {
  return [
    ...storePending(config),
    ...productPending(config.products['13'], config),
    ...productPending(config.products['22'], config),
  ]
}

export const hasEssential = (items: PendingItem[]) => items.some((i) => i.level === 'essential')
