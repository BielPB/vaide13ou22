/**
 * Tipos do arquivo central de configuração da loja.
 *
 * Convenção: `null` significa "dado ainda não confirmado". A interface nunca
 * preenche um `null` com um valor inventado — em modo prévia ela mostra a
 * pendência; em modo publicado ela oculta o bloco ou bloqueia a compra.
 */

export type ProductId = '13' | '22'

/** Status de publicação. Só `live` libera compra — e apenas se não houver pendências essenciais. */
export type StoreStatus = 'preview' | 'live'

export interface StoreInfo {
  /** NOME_DA_LOJA — nome comercial exibido no cabeçalho, título e rodapé. */
  name: string | null
  /** IDENTIFICACAO_DO_VENDEDOR — razão social / nome do responsável. */
  legalName: string | null
  /** CNPJ ou CPF do vendedor, como deve aparecer no rodapé. */
  documentId: string | null
  /**
   * Declaração de independência. `confirmed` precisa ser `true` para que o texto
   * seja publicado — confirme que a loja não tem vínculo oficial com partidos,
   * candidatos ou com as pessoas citadas.
   */
  independence: { statement: string; confirmed: boolean }
  /** URL pública final da loja (usada em canonical, og:url e dados estruturados). */
  siteUrl: string | null
}

export interface ContactInfo {
  /** WhatsApp: número internacional sem símbolos, ex.: 5521999999999. */
  whatsapp: string | null
  /** Telefone para ligação, como deve aparecer, ex.: "(21) 96952-6716". */
  phone: string | null
  email: string | null
  instagram: string | null
  /** Horário de atendimento, ex.: "Seg. a sex., 9h às 18h". */
  hours: string | null
}

export interface ProductImage {
  /** Caminho do arquivo em /public ou URL absoluta. `null` = foto ainda não enviada. */
  src: string | null
  /** Versões responsivas opcionais: "caminho largura" (ex.: "/produtos/x-800.webp 800w"). */
  srcSet?: string
  /** Legenda curta da foto: cor, ângulo ou detalhe (ex.: "Azul", "Detalhe do patch"). */
  label: string
  alt: string
  width: number
  height: number
  /**
   * `true` para ilustrações provisórias. Imagens ilustrativas recebem o selo
   * "Ilustração" e nunca contam como foto real do produto.
   */
  illustrative: boolean
}

/** Uma opção comprável (SKU): normalmente a cor de um modelo. */
export interface ProductVariant {
  id: string
  /** Nome exibido, ex.: "Azul". */
  label: string
  /** Unidades disponíveis. `null` = não informado (a interface não exibe contagem). */
  stock: number | null
  /** `false` força "Indisponível" mesmo com estoque. */
  available: boolean
  /** `src` da foto do modelo que mostra esta opção (a galeria vai até ela). */
  image: string | null
  /** Tamanho (camisas). Com tamanho, a página mostra seletor de cor + tamanho. */
  size?: string
  /**
   * CHECKOUT_POR_PRODUTO_OU_VARIANTE — link de checkout desta opção,
   * copiado do painel do provedor real. Nunca invente um link.
   * Yampi: cole o "Link de compra" (https://seguro.suaLoja.com.br/r/TOKEN).
   */
  checkoutUrl: string | null
}

/** Preço unitário a partir de uma quantidade, ex.: 2 ou mais por R$ 39,90 cada. */
export interface PriceTier {
  minQuantity: number
  /** Preço de referência por unidade, exibido como "R$ 39,90 cada". */
  priceCents: number
  /**
   * Porcentagem do cupom na Yampi (o desconto do cupom é em %).
   * O subtotal do site usa esta porcentagem, igual ao checkout.
   */
  percent: number
  /**
   * Código do cupom na Yampi (regras: quantidade mínima = minQuantity, produtos
   * específicos). O site envia ?promocode=CODIGO no link quando a faixa é atingida.
   */
  coupon: string
}

export interface ProductSpecs {
  material: string | null
  /** Tipo de fechamento/ajuste, ex.: "Regulador traseiro com fivela". */
  closure: string | null
  /** Medidas, uma por linha: [rótulo, valor]. */
  measurements: Array<[label: string, value: string]> | null
  /**
   * Aviso exibido junto das medidas (ex.: "medidas de referência, podem variar 2 cm").
   * Preencha sempre que as medidas não tiverem sido tiradas das próprias peças.
   */
  measurementsNote?: string
  care: string | null
  /** Benefícios curtos derivados APENAS de atributos confirmados acima. */
  highlights: string[]
}

/** Descrição de venda completa (fonte única: src/config/descricoes.json). **negrito** vira destaque. */
export interface ModelAbout {
  slug: string
  abertura: string[]
  destaques: string[]
  quandoUsar: string
  cores: string
  ficha: Array<[label: string, value: string]>
}

/** Um modelo dentro da linha 13 ou 22 (ex.: "Camuflado"), com suas cores. */
export interface ProductModel {
  id: string
  name: string
  /** Tipo de peça. Padrão: boné. Camisas não têm "fechamento" e usam tabela de medidas. */
  category?: 'bone' | 'camisa'
  /** Descrição de venda completa, a mesma usada na Yampi. */
  about?: ModelAbout
  /** Descrição curta, apenas com o que é visível nas fotos ou confirmado. */
  description: string | null
  /** Preço de 1 unidade, em centavos. `null` = pendente. */
  priceCents: number | null
  /**
   * Preço anterior ("de"), exibido riscado. Só preencha com preço REALMENTE
   * praticado antes (CDC art. 37) e registre onde em `compareAtSource`.
   */
  compareAtCents?: number
  /** Onde/quando o preço anterior foi praticado — guarde comprovantes. */
  compareAtSource?: string
  /** Preços por quantidade da MESMA cor (mesma variação/SKU). Precisam estar configurados igual no checkout. */
  tiers: PriceTier[]
  images: ProductImage[]
  variants: ProductVariant[]
  specs: ProductSpecs
}

export interface Product {
  id: ProductId
  /** Nome curto usado em botões: "boné 13". */
  shortName: string
  /** Nome completo da linha. */
  name: string
  /** Número usado na composição visual. */
  number: ProductId
  /** Frase curta de apresentação (sem promessa política). `null` = pendente. */
  tagline: string | null
  /** Imagem do hero e do card de seleção. */
  heroImage: ProductImage
  models: ProductModel[]
}

/**
 * Integração de compra.
 * - `none`: nenhum checkout configurado. A página funciona como prévia.
 * - `yampi`: Yampi. Cada variante recebe o "Link de compra" copiado do painel
 *   (Produtos → produto → Resumo → 🔗 Link de compra), no formato
 *   https://seguro.suaLoja.com.br/r/TOKEN. A página monta /r/TOKEN:QUANTIDADE,
 *   formato documentado pela Yampi, e o checkout da Yampi calcula frete e total.
 * - `link`: um link de checkout por variante (Mercado Pago, PagSeguro, Shopify
 *   Buy Button link, Nuvemshop, Yampi etc.). Parâmetros de quantidade só são
 *   adicionados quando `quantity.mode === 'param'` — use somente se a
 *   documentação do provedor suportar.
 *
 * Carrinho futuro: a lógica já trabalha com `PurchaseLine[]` (src/lib/purchase.ts);
 * o adaptador Yampi já monta links com vários itens.
 */
export type CheckoutConfig =
  | { kind: 'none' }
  | {
      kind: 'yampi'
      /** Domínio do checkout como aparece no Link de compra, ex.: "seguro.minhaloja.com.br". */
      checkoutHost: string | null
      /** Máximo de unidades por pedido oferecido nesta página (o estoque também limita). */
      maxQuantity: number
    }
  | {
      kind: 'link'
      providerName: string
      quantity:
        | { mode: 'fixed-one' }
        | { mode: 'param'; param: string; max: number }
        | { mode: 'chosen-at-checkout' }
    }

export interface CommerceInfo {
  /**
   * Frete grátis para pedidos ACIMA deste valor (em centavos). `null` = sem oferta.
   * Precisa estar configurado igual no checkout (Yampi → frete grátis por valor).
   */
  freeShippingAboveCents: number | null
  /** Onde vale o frete grátis, como deve aparecer: "todo o Brasil". */
  freeShippingRegion: string | null
  /**
   * `true` somente depois de criar os cupons de 2+ na Yampi e conferir cada um
   * pelo link no checkout. Enquanto `false`, o site ignora `tiers`:
   * não anuncia nem calcula o preço de 2+, para nunca prometer o que o checkout não cobra.
   */
  quantityDiscountActive: boolean
  /** CONDICOES_DE_FRETE — como o frete é calculado/cobrado e para onde a loja envia. */
  shipping: string | null
  /** Prazo de postagem após confirmação do pagamento. */
  dispatchTime: string | null
  /** Versão curta para a lista da compra (ex.: "Postagem em até 2 dias úteis"). */
  dispatchShort?: string
  /** PAGAMENTOS — formas aceitas exatamente como aparecem no checkout. */
  payments: string[] | null
  /** Frase curta sob o preço (ex.: "No Pix ou em até 12x no cartão"). */
  paymentsShort?: string
  /** Política de trocas e devoluções (resumo). */
  returns: string | null
  /** Como acompanhar o pedido. */
  tracking: string | null
  /** As fotos publicadas são do produto vendido? */
  photosMatchProduct: boolean | null
  /** Como ajustar o boné / tabela de medidas (quando existir). */
  fitGuide: string | null
}

export interface PolicyDoc {
  id: 'privacidade' | 'sobre' | 'trocas' | 'termos' | 'cookies'
  title: string
  /** Texto completo ou resumo. `null` = POLITICAS pendente. */
  body: string | null
}

/** Avaliação de um cliente real. Só entram avaliações verificadas de compras. */
export interface Review {
  /** Nome como o cliente autorizou exibir (ex.: "Carlos E."). */
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  productId: ProductId
  modelId: string
  /** Cor/opção comprada, ex.: "Preto". */
  variantLabel?: string
  /** Data ISO, ex.: "2026-09-20". */
  date: string
  /** Foto enviada pelo cliente (em /public). */
  photo?: string
  verified: true
  /** Origem (print, link do WhatsApp/Instagram), para auditoria. */
  sourceUrl?: string
}

/** Modelo (e cor) aberto numa página de produto. */
export interface DefaultSelection {
  productId: ProductId
  modelId: string
  variantId?: string
}

export interface StoreConfig {
  status: StoreStatus
  store: StoreInfo
  contact: ContactInfo
  products: Record<ProductId, Product>
  checkout: CheckoutConfig
  commerce: CommerceInfo
  policies: PolicyDoc[]
  /** Deixe vazio enquanto não houver avaliações verificadas — a seção some. */
  reviews: Review[]
  /** Imagem de compartilhamento (1200 × 630). */
  shareImage: string
  /** Banner largo do topo (arte em /public). Ausente ou `null` = a seção não aparece. */
  banner?: HomeBanner | null
}

/** Arte do banner do topo. `mobileSrc` (opcional) é uma versão mais alta para celular. */
export interface HomeBanner {
  src: string
  alt: string
  width: number
  height: number
  mobileSrc?: string
  mobileWidth?: number
  mobileHeight?: number
}
