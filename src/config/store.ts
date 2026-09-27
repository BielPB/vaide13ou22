import descricoes from './descricoes.json'
import { reviews } from './reviews.ts'
import { politicaCookies, politicaPrivacidade, politicaTrocas, resumoTrocas, sobreLoja, termosVenda } from './policies.ts'
import type { ModelAbout, ProductImage, ProductModel, StoreConfig } from './types.ts'

/**
 * ARQUIVO CENTRAL DE CONFIGURAÇÃO
 * ------------------------------------------------------------------
 * Tudo o que a loja exibe vem daqui. Os campos `null` são pendências:
 * enquanto existirem, a página funciona como prévia e a compra fica
 * bloqueada. Veja README.md → "Como editar" e PENDENCIAS.md.
 */

const emptySpecs = (): ProductModel['specs'] => ({
  material: null,
  closure: null,
  measurements: null,
  care: null,
  highlights: [],
})

/** Foto de produto em /public/produtos. */
const photo = (src: string, label: string, alt: string, width = 450, height = 450): ProductImage => ({
  src: `/produtos/${src}`,
  label,
  alt,
  width,
  height,
  illustrative: false,
})

/** Domínio do checkout da Yampi (tirado dos Links de compra). */
const YAMPI_HOST = 'vai-de-13-ou-22.pay.yampi.com.br'

/**
 * Opção (cor). `token` é o final do Link de compra da Yampi desta cor
 * (https://${YAMPI_HOST}/r/TOKEN). `image: null` = cor ainda sem foto.
 */
const colorOption = (id: string, label: string, image: string | null, token: string | null = null) => ({
  id,
  label,
  stock: null,
  available: true,
  image: image ? `/produtos/${image}` : null,
  checkoutUrl: token ? `https://${YAMPI_HOST}/r/${token}` : null,
})

/**
 * Ficha informada pelo vendedor para Brasil e bandeira; o vendedor pediu a mesma
 * para o Flávio Bolsonaro. Tecido (material) ainda não informado.
 */
const strapbackSpecs = (): ProductModel['specs'] => ({
  material: null,
  closure: 'Regulagem traseira ajustável (fitão/strapback)',
  measurements: [['Tamanho', 'Único, regulável']],
  care: null,
  highlights: [
    'Regulagem tipo fitão: ajusta a diferentes tamanhos de cabeça.',
    'Aba curva.',
    'Costura reforçada.',
    'Leve e ventilado, para usar o dia todo.',
    'Boa fixação de cor com o uso frequente.',
  ],
})

/** Opção de camisa: cor + tamanho, cada uma com seu Link de compra. */
const shirt = (color: string, label: string, size: string, image: string, token: string) => ({
  ...colorOption(`${color}-${size.toLowerCase()}`, label, image, token),
  size,
})

const camisaLula: ProductModel = {
  id: 'camisa',
  name: 'Camisa Lula 13',
  category: 'camisa',
  description:
    'Camiseta 100% algodão com o rosto do Lula, o nome em destaque e a frase “Brilha uma estrela”. Modelagem unissex, em sete cores.',
  priceCents: 4990,
  compareAtCents: 7990,
  compareAtSource: 'Preço praticado na loja física do vendedor (informado em 26/09/2026)',
  tiers: [],
  images: [
    photo('13-camisa/branca.webp', 'Branca', 'Camisa Lula 13 branca com o rosto do Lula e a frase Brilha uma estrela', 1024, 1024),
    photo('13-camisa/camisa-marrom.webp', 'Marrom', 'Camisa Lula 13 marrom com o rosto do Lula e a frase Brilha uma estrela', 1024, 1024),
    photo('13-camisa/camisa-rosa.webp', 'Rosa', 'Camisa Lula 13 rosa com o rosto do Lula e a frase Brilha uma estrela', 1024, 1024),
    photo('13-camisa/cinza.webp', 'Cinza', 'Camisa Lula 13 cinza com o rosto do Lula e a frase Brilha uma estrela', 1024, 1024),
    photo('13-camisa/marrom-escuro.webp', 'Marrom escuro', 'Camisa Lula 13 marrom escuro com o rosto do Lula e a frase Brilha uma estrela', 1024, 1024),
    photo('13-camisa/preta-vermelha.webp', 'Preta', 'Camisa Lula 13 preta com o rosto do Lula e a frase Brilha uma estrela', 1024, 1024),
    photo('13-camisa/vermelha.webp', 'Vermelha', 'Camisa Lula 13 vermelha com o rosto do Lula e a frase Brilha uma estrela', 1024, 1024),
  ],
  variants: [
      shirt('branca', 'Branca', 'P', '13-camisa/branca.webp', 'KCY1XHMG4A'),
      shirt('branca', 'Branca', 'M', '13-camisa/branca.webp', 'FK6URTO430'),
      shirt('branca', 'Branca', 'G', '13-camisa/branca.webp', 'OOLW6IGBUU'),
      shirt('branca', 'Branca', 'GG', '13-camisa/branca.webp', 'TTRT6FNFZQ'),
      shirt('marrom', 'Marrom', 'P', '13-camisa/camisa-marrom.webp', 'IZ9ZTV1EC2'),
      shirt('marrom', 'Marrom', 'M', '13-camisa/camisa-marrom.webp', 'B5LLDTBKNO'),
      shirt('marrom', 'Marrom', 'G', '13-camisa/camisa-marrom.webp', 'DN5IQUBJ4G'),
      shirt('marrom', 'Marrom', 'GG', '13-camisa/camisa-marrom.webp', 'RGJO7636SV'),
      shirt('rosa', 'Rosa', 'P', '13-camisa/camisa-rosa.webp', 'GRE2BIIO4B'),
      shirt('rosa', 'Rosa', 'M', '13-camisa/camisa-rosa.webp', 'M9H4SPI95E'),
      shirt('rosa', 'Rosa', 'G', '13-camisa/camisa-rosa.webp', '1TYHDSUHJL'),
      shirt('rosa', 'Rosa', 'GG', '13-camisa/camisa-rosa.webp', 'OK75KLYL3H'),
      shirt('cinza', 'Cinza', 'P', '13-camisa/cinza.webp', 'K02MJDL7AR'),
      shirt('cinza', 'Cinza', 'M', '13-camisa/cinza.webp', 'PJZT49071S'),
      shirt('cinza', 'Cinza', 'G', '13-camisa/cinza.webp', 'DJBWHTD4J1'),
      shirt('cinza', 'Cinza', 'GG', '13-camisa/cinza.webp', 'O9WMETTBAG'),
      shirt('marrom-escuro', 'Marrom escuro', 'P', '13-camisa/marrom-escuro.webp', 'D62B1P1YW1'),
      shirt('marrom-escuro', 'Marrom escuro', 'M', '13-camisa/marrom-escuro.webp', 'RZHXOP2GW2'),
      shirt('marrom-escuro', 'Marrom escuro', 'G', '13-camisa/marrom-escuro.webp', '5T5RR3FMBW'),
      shirt('marrom-escuro', 'Marrom escuro', 'GG', '13-camisa/marrom-escuro.webp', '3CRJV5MPTJ'),
      shirt('preta', 'Preta', 'P', '13-camisa/preta-vermelha.webp', 'H05GOEF7Q7'),
      shirt('preta', 'Preta', 'M', '13-camisa/preta-vermelha.webp', 'I8IG2Q12O6'),
      shirt('preta', 'Preta', 'G', '13-camisa/preta-vermelha.webp', 'J5GW8CWWWE'),
      shirt('preta', 'Preta', 'GG', '13-camisa/preta-vermelha.webp', '9DCZ5JGWXK'),
      shirt('vermelha', 'Vermelha', 'P', '13-camisa/vermelha.webp', 'ACWCASFWAM'),
      shirt('vermelha', 'Vermelha', 'M', '13-camisa/vermelha.webp', 'G88THHA0LV'),
      shirt('vermelha', 'Vermelha', 'G', '13-camisa/vermelha.webp', 'QMP3PQ3LW7'),
      shirt('vermelha', 'Vermelha', 'GG', '13-camisa/vermelha.webp', 'JIH6RHVQ1U'),
  ],
  // Ficha do fornecedor (informada pelo vendedor em 26/09/2026).
  specs: {
    material: '100% algodão, fio 30.1',
    closure: null, // não se aplica a camisa
    // Tabela de REFERÊNCIA (o vendedor não tem a tabela do fornecedor). Troque pelas medidas das peças quando puder.
    measurements: [
      ['P', 'Largura 50 cm · Comprimento 70 cm'],
      ['M', 'Largura 53 cm · Comprimento 72 cm'],
      ['G', 'Largura 56 cm · Comprimento 74 cm'],
      ['GG', 'Largura 59 cm · Comprimento 76 cm'],
    ],
    measurementsNote: 'Medidas de referência de camiseta unissex básica, com a peça esticada na mesa: largura de axila a axila e comprimento do ombro até a barra. Podem variar até 2 cm. Dica: compare com uma camiseta sua que veste bem. Na dúvida, chame no WhatsApp.',
    care: 'Lavar com água fria ou morna, sem alvejante com cloro. Secar à sombra. Passar em temperatura média e evitar secadora em alta temperatura.',
    highlights: [
      'Malha 100% algodão fio 30.1: toque macio, leve e respirável.',
      'Gola careca em ribana, com reforço.',
      'Costuras reforçadas, para durar mais.',
      'Modelagem unissex, gola redonda e manga curta.',
      'Estampa frontal grande, com o rosto e o nome em destaque.',
    ],
  },
}

const camisaBolsonaro: ProductModel = {
  id: 'camisa',
  name: 'Camisa Bolsonaro 22',
  category: 'camisa',
  description:
    'Camiseta de algodão com “Tropa do Bolsonaro” no peito e a faixa verde e amarela logo abaixo. Modelagem unissex, em branca e preta.',
  priceCents: 4990,
  compareAtCents: 7990,
  compareAtSource: 'Preço praticado na loja física do vendedor (informado em 26/09/2026)',
  tiers: [],
  images: [
    photo('22-camisa/branca-bombado.webp', 'Branca', 'Camisa Bolsonaro 22 branca com Tropa do Bolsonaro no peito', 1024, 1024),
    photo('22-camisa/preta-bombado.webp', 'Preta', 'Camisa Bolsonaro 22 preta com Tropa do Bolsonaro no peito', 939, 939),
    photo('22-camisa/branca-gordinho.webp', 'Branca em uso', 'Pessoa usando a Camisa Bolsonaro 22 branca', 900, 900),
    photo('22-camisa/preta-gordinho.webp', 'Preta em uso', 'Pessoa usando a Camisa Bolsonaro 22 preta', 900, 900),
  ],
  variants: [
      shirt('branca', 'Branca', 'P', '22-camisa/branca-bombado.webp', 'TQXD4SZV8E'),
      shirt('branca', 'Branca', 'M', '22-camisa/branca-bombado.webp', 'KO8EDDZV3N'),
      shirt('branca', 'Branca', 'G', '22-camisa/branca-bombado.webp', 'QFO49IDTE1'),
      shirt('branca', 'Branca', 'GG', '22-camisa/branca-bombado.webp', 'PFU4QTQZTB'),
      shirt('preta', 'Preta', 'P', '22-camisa/preta-bombado.webp', '6THPCT18BC'),
      shirt('preta', 'Preta', 'M', '22-camisa/preta-bombado.webp', '6P7W0GJ3OB'),
      shirt('preta', 'Preta', 'G', '22-camisa/preta-bombado.webp', '5V6J051YIB'),
      shirt('preta', 'Preta', 'GG', '22-camisa/preta-bombado.webp', '4BDV8LLHFA'),
  ],
  // Ficha do fornecedor (informada pelo vendedor em 26/09/2026). O fornecedor escreve
  // "100% algodão (ou conforme o modelo)" e "silk ou DTF": confirmar o lote vendido.
  specs: {
    material: '100% algodão',
    closure: null, // não se aplica a camisa
    // Tabela de REFERÊNCIA (o vendedor não tem a tabela do fornecedor). Troque pelas medidas das peças quando puder.
    measurements: [
      ['P', 'Largura 50 cm · Comprimento 70 cm'],
      ['M', 'Largura 53 cm · Comprimento 72 cm'],
      ['G', 'Largura 56 cm · Comprimento 74 cm'],
      ['GG', 'Largura 59 cm · Comprimento 76 cm'],
    ],
    measurementsNote: 'Medidas de referência de camiseta unissex básica, com a peça esticada na mesa: largura de axila a axila e comprimento do ombro até a barra. Podem variar até 2 cm. Dica: compare com uma camiseta sua que veste bem. Na dúvida, chame no WhatsApp.',
    care: 'Lavar com água fria ou morna, sem alvejante com cloro. Secar à sombra. Passar em temperatura média e evitar secadora em alta temperatura.', // mesmos da camisa do Lula (confirmado pelo vendedor)
    highlights: [
      'Estampa “Tropa do Bolsonaro” em destaque no peito, com a faixa verde e amarela.',
      'Estampa de alta definição, resistente a lavagens.',
      'Tecido leve e de toque suave, para o dia a dia.',
      'Modelagem unissex, gola redonda e manga curta.',
      'Costura reforçada.',
    ],
  },
}

const models22: ProductModel[] = [
  {
    id: 'nome-bandeira',
    name: 'Brasil e bandeira',
    description: 'Frente com a palavra BRASIL e a bandeira do Brasil. Aba curva e regulagem atrás.',
    priceCents: 4790,
    compareAtCents: 5990,
    compareAtSource: 'Preço praticado anteriormente (informado pelo vendedor em 26/09/2026)',
    tiers: [],
    images: [
      photo('22-bandeira/1.webp', 'Azul', 'Boné Brasil e bandeira azul, com BRASIL e bandeira na frente'),
      photo('22-bandeira/2.webp', 'Preto', 'Boné Brasil e bandeira preto, com BRASIL e bandeira na frente'),
      photo('22-bandeira/3.webp', 'Verde', 'Boné Brasil e bandeira verde, com BRASIL e bandeira na frente'),
      photo('22-bandeira/4.webp', 'Amarelo', 'Boné Brasil e bandeira amarelo, com BRASIL e bandeira na frente'),
      photo('22-bandeira/5.webp', 'Branco', 'Boné Brasil e bandeira branco, com BRASIL e bandeira na frente', 1024, 1024),
    ],
    variants: [
      colorOption('azul', 'Azul', '22-bandeira/1.webp', 'GC9QPIAGGQ'),
      colorOption('preto', 'Preto', '22-bandeira/2.webp', '15IZH356NY'),
      colorOption('verde', 'Verde', '22-bandeira/3.webp', 'AYRDOYX7TL'),
      colorOption('amarelo', 'Amarelo', '22-bandeira/4.webp', 'Q5P4YDNEUK'),
      colorOption('branco', 'Branco', '22-bandeira/5.webp', 'BLQ4TUSO5N'),
    ],
    specs: strapbackSpecs(),
  },
  {
    id: 'simples',
    name: 'Simples',
    description: 'Liso, sem aplicação na frente.',
    priceCents: 3590,
    tiers: [],
    images: [
      photo('22-simples/azul.webp', 'Azul', 'Boné Simples azul, liso'),
      photo('22-simples/verde.webp', 'Verde', 'Boné Simples verde, liso'),
    ],
    variants: [colorOption('azul', 'Azul', '22-simples/azul.webp', 'G7SZEGNIM9'), colorOption('verde', 'Verde', '22-simples/verde.webp', '9LB2I23B8K')],
    specs: emptySpecs(),
  },
  {
    id: 'camuflado',
    name: 'Camuflado',
    description: 'Estilo militar, com patch da bandeira do Brasil na frente.',
    priceCents: 5990,
    compareAtCents: 7990,
    compareAtSource: 'Preço praticado anteriormente (informado pelo vendedor em 26/09/2026)',
    tiers: [],
    images: [
      // Cores das fotos 3 (cinza) e 4 (verde-oliva) confirmadas pelo vendedor em 26/09/2026.
      photo('22-camuflado/1.webp', 'Três cores', 'Bonés do modelo Camuflado nas cores camuflado, preto e cinza', 450, 600),
      photo('22-camuflado/2.webp', 'Preto', 'Boné Camuflado preto com patch da bandeira', 450, 600),
      photo('22-camuflado/4.webp', 'Verde-oliva', 'Pessoa usando o boné Camuflado verde-oliva', 450, 600),
      photo('22-camuflado/6.webp', 'Camuflado', 'Boné Camuflado na estampa camuflada com patch da bandeira', 450, 600),
      photo('22-camuflado/3.webp', 'Cinza', 'Boné Camuflado cinza com patch da bandeira', 450, 600),
      photo('22-camuflado/5.webp', 'Detalhe do patch', 'Detalhe do patch da bandeira no boné preto', 450, 600),
    ],
    variants: [
      colorOption('preto', 'Preto', '22-camuflado/2.webp', 'CVC4ONB2WI'),
      colorOption('oliva', 'Verde-oliva', '22-camuflado/4.webp', 'KOB33NE5JA'),
      colorOption('camuflado', 'Camuflado', '22-camuflado/6.webp', 'TP5ICRX09U'),
      colorOption('cinza', 'Cinza', '22-camuflado/3.webp', 'CLFY0H6VJ4'),
    ],
    // Ficha informada pelo vendedor.
    specs: {
      material: 'Poliéster',
      closure: 'Fivela e ilhós na parte traseira',
      measurements: [['Tamanho', 'Único, regulável']],
      care: null,
      highlights: [
        'Fechamento com fivela: ajuste firme para diferentes tamanhos. Unissex.',
        'Aba curva com visor rígido, que mantém o formato.',
        'Forro interno macio e faixa que absorve o suor.',
        'Poliéster resistente ao uso do dia a dia.',
      ],
    },
  },
  {
    id: 'flavio',
    name: 'Flávio Bolsonaro',
    description: 'Estilo trucker, com tela atrás e “Flávio Bolsonaro” na frente. Aba curva e regulagem atrás.',
    priceCents: 3790,
    compareAtCents: 4990,
    compareAtSource: 'Preço praticado anteriormente (informado pelo vendedor em 26/09/2026)',
    tiers: [],
    images: [
      photo('22-flavio/2.webp', 'Amarelo', 'Boné Flávio Bolsonaro amarelo, estilo trucker'),
      photo('22-flavio/3.webp', 'Azul', 'Boné Flávio Bolsonaro azul, estilo trucker'),
      photo('22-flavio/4.webp', 'Verde', 'Boné Flávio Bolsonaro verde, estilo trucker'),
      photo('22-flavio/1.webp', 'Preto', 'Pessoa usando o boné Flávio Bolsonaro preto'),
    ],
    variants: [
      colorOption('preto', 'Preto', '22-flavio/1.webp', 'KTS6AXK3UX'),
      colorOption('amarelo', 'Amarelo', '22-flavio/2.webp', 'MTNPL7P43V'),
      colorOption('azul', 'Azul', '22-flavio/3.webp', 'T3L4M32HER'),
      colorOption('verde', 'Verde', '22-flavio/4.webp', 'RP2EC3WKXI'),
    ],
    specs: strapbackSpecs(),
  },
]

/**
 * Lado 13. Modelos com a marca Lula: R$ 45,90. Simples vermelho e Trucker liso: R$ 39,90.
 * Sem desconto por quantidade (decisão do vendedor; o plano da Yampi não libera cupons).
 */
const models13: ProductModel[] = [
  {
    id: 'nome-lula-estrela',
    name: 'Lula (estrela)',
    description: 'Estilo trucker, com tela atrás e “LULA” com estrela na frente.',
    priceCents: 4590,
    compareAtCents: 5490,
    compareAtSource: 'Preço praticado na loja física do vendedor (informado em 26/09/2026)',
    tiers: [],
    images: [
      photo('13-nome-lula/4.webp', 'Vermelho', 'Boné Lula vermelho, estilo trucker, com LULA e estrela na frente'),
      photo('13-nome-lula/3.webp', 'Preto', 'Boné Lula preto, estilo trucker'),
      photo('13-nome-lula/5.webp', 'Branco', 'Boné Lula branco, estilo trucker'),
      photo('13-nome-lula/6.webp', 'Branco e preto', 'Boné Lula com frente branca e tela preta'),
      photo('13-nome-lula/2.webp', 'Em uso', 'Pessoa usando o boné Lula vermelho'),
      photo('13-nome-lula/1.webp', 'Detalhes', 'Boné Lula vermelho com a lista de características do fornecedor'),
    ],
    variants: [
      colorOption('vermelho', 'Vermelho', '13-nome-lula/4.webp', 'BSE1DAV8IX'),
      colorOption('preto', 'Preto', '13-nome-lula/3.webp', 'MTT0MGIJZA'),
      colorOption('branco', 'Branco', '13-nome-lula/5.webp', 'OHAOJ2ER1T'),
      colorOption('branco-preto', 'Branco e preto', '13-nome-lula/6.webp', 'CIQUQ75E6W'),
    ],
    // Imagem do fornecedor (13-nome-lula/1.webp): DTF, tela respirável, leve, durável e fecho ajustável.
    specs: { ...emptySpecs(), closure: 'Fecho ajustável atrás' },
  },
  {
    id: 'numero-13',
    name: 'Número 13',
    description: 'Estilo trucker, com tela atrás e o número 13 grande na frente.',
    priceCents: 4590,
    compareAtCents: 5490,
    compareAtSource: 'Preço praticado na loja física do vendedor (informado em 26/09/2026)',
    tiers: [],
    images: [
      photo('13-numero/3.webp', 'Vermelho', 'Boné Número 13 vermelho, com 13 branco na frente', 800, 800),
      photo('13-numero/2.webp', 'Preto', 'Boné Número 13 preto, com 13 vermelho na frente'),
      photo('13-numero/4.webp', 'Vermelho: ângulos', 'Boné Número 13 vermelho visto de vários ângulos'),
      photo('13-numero/1.webp', 'Preto: ângulos', 'Boné Número 13 preto visto de vários ângulos'),
      photo('13-numero/5.webp', 'Em uso', 'Pessoa usando o boné Número 13 preto'),
    ],
    variants: [colorOption('vermelho', 'Vermelho', '13-numero/3.webp', 'KXCGAPO8S5'), colorOption('preto', 'Preto', '13-numero/2.webp', 'EJG5S7SW52')],
    specs: emptySpecs(),
  },
  {
    id: 'nome-lula-letras',
    name: 'Lula (letras grandes)',
    description: 'Estilo trucker, com tela atrás e “LULA” em letras grandes na frente.',
    priceCents: 4590,
    compareAtCents: 5490,
    compareAtSource: 'Preço praticado na loja física do vendedor (informado em 26/09/2026)',
    tiers: [],
    images: [
      photo('13-nome-lula-2/1.webp', 'Vermelho', 'Boné Lula vermelho com LULA em letras grandes'),
      photo('13-nome-lula-2/4.webp', 'Branco', 'Boné Lula branco com LULA em vermelho', 829, 829),
      photo('13-nome-lula-2/5.webp', 'Branco e vermelho', 'Boné Lula com frente branca e aba e tela vermelhas', 796, 796),
      photo('13-nome-lula-2/6.webp', 'Preto', 'Boné Lula preto com LULA em branco', 1024, 1024),
      photo('13-nome-lula-2/2.webp', 'Em uso', 'Pessoa usando o boné Lula vermelho', 1024, 1024),
      photo('13-nome-lula-2/3.webp', 'Ângulos', 'Boné Lula vermelho visto de vários ângulos', 1024, 1024),
    ],
    variants: [
      colorOption('vermelho', 'Vermelho', '13-nome-lula-2/1.webp', 'FZSSM5MOJC'),
      colorOption('branco', 'Branco', '13-nome-lula-2/4.webp', 'DZIG8ERVJX'),
      colorOption('branco-vermelho', 'Branco e vermelho', '13-nome-lula-2/5.webp', '5HMZOF23ZO'),
      colorOption('preto', 'Preto', '13-nome-lula-2/6.webp', '4ZP3F2B3FX'),
    ],
    specs: emptySpecs(),
  },
  {
    id: 'simples',
    name: 'Simples',
    description: 'Liso, sem aplicação na frente.',
    priceCents: 3990,
    compareAtCents: 4990,
    compareAtSource: 'Preço praticado na loja física do vendedor (informado em 26/09/2026)',
    tiers: [],
    images: [photo('13-simples/vermelho.webp', 'Vermelho', 'Boné Simples vermelho, liso')],
    variants: [colorOption('vermelho', 'Vermelho', '13-simples/vermelho.webp', 'PXET236H1D')],
    specs: emptySpecs(),
  },
  {
    id: 'trucker-liso',
    name: 'Trucker liso',
    description: 'Estilo trucker, com tela atrás, sem estampa.',
    priceCents: 3990,
    compareAtCents: 4990,
    compareAtSource: 'Preço praticado na loja física do vendedor (informado em 26/09/2026)',
    tiers: [],
    images: [photo('13-nome-lula-2/7.webp', 'Preto', 'Boné trucker preto sem estampa')],
    variants: [colorOption('preto', 'Preto', '13-nome-lula-2/7.webp', 'MPXPL35PB7')],
    specs: emptySpecs(),
  },
]

export const storeConfig: StoreConfig = {
  // Loja publicada: o botão de compra leva ao checkout da Yampi.
  status: 'live',

  store: {
    name: 'vaide13ou22',
    // O vendedor optou por não exibir nome completo nem CPF/CNPJ (veja PENDENCIAS.md).
    legalName: null,
    documentId: null,
    independence: {
      statement:
        'Loja independente. Não temos vínculo com partidos, campanhas, candidatos ou com as pessoas citadas, e as vendas não são doações. Os nomes e números identificam os modelos dos produtos.',
      confirmed: true, // confirmado pelo vendedor em 26/09/2026
    },
    siteUrl: null,
  },

  contact: {
    whatsapp: '5521969526716',
    phone: '(21) 96952-6716', // exibido junto ao botão de WhatsApp
    email: null,
    instagram: null,
    hours: null,
  },

  products: {
    '13': {
      id: '13',
      number: '13',
      shortName: 'Lula 13',
      name: 'Lula 13',
      tagline: 'Cinco modelos: Lula (estrela), Número 13, Lula (letras grandes), Simples e Trucker liso.',
      heroImage: photo('13-numero/3.webp', 'Número 13 · Vermelho', 'Boné Número 13 vermelho, com 13 branco na frente', 800, 800),
      models: [...models13, camisaLula],
    },
    '22': {
      id: '22',
      number: '22',
      shortName: 'Bolsonaro 22',
      name: 'Bolsonaro 22',
      tagline: 'Quatro modelos: Brasil e bandeira, Simples, Camuflado e Flávio Bolsonaro.',
      heroImage: photo('22-flavio/2.webp', 'Flávio Bolsonaro · Amarelo', 'Boné Flávio Bolsonaro amarelo, estilo trucker'),
      models: [...models22, camisaBolsonaro],
    },
  },

  // Yampi: preencha o domínio do checkout e o Link de compra de cada cor.
  checkout: { kind: 'yampi', checkoutHost: YAMPI_HOST, maxQuantity: 10 },

  commerce: {
    freeShippingAboveCents: 14990, // frete grátis acima de R$ 149,90
    freeShippingRegion: 'todo o Brasil',
    // Sem desconto por quantidade. Se um dia houver: cupom da Yampi por link (tiers[].coupon),
    // testado no checkout antes de trocar para true.
    quantityDiscountActive: false,
    shipping: 'Enviamos para todo o Brasil. O frete e o prazo de entrega são calculados pelo CEP no checkout; acima de R$ 149,90, o frete é grátis.',
    dispatchTime: 'Postamos em até 2 dias úteis após a confirmação do pagamento.',
    dispatchShort: 'Postagem em até 2 dias úteis',
    payments: ['Pix', 'Cartão de crédito em até 12x'],
    paymentsShort: 'No Pix ou em até 12x no cartão',
    returns: resumoTrocas,
    // Canal do rastreio a confirmar com o vendedor (e-mail da Yampi ou WhatsApp).
    tracking: 'Após a postagem, você recebe o código de rastreio pelos contatos informados no pedido.',
    trackingUrl: 'https://rastreamento.correios.com.br/app/index.php',
    photosMatchProduct: true, // confirmado pelo vendedor
    fitGuide: null,
  },

  policies: [
    // Rascunhos em src/config/policies.ts (CDC + LGPD). Revisar antes de publicar.
    { id: 'privacidade', title: 'Política de privacidade', body: politicaPrivacidade },
    { id: 'sobre', title: 'Sobre a loja', body: sobreLoja },
    { id: 'trocas', title: 'Trocas e devoluções', body: politicaTrocas },
    { id: 'termos', title: 'Termos de venda', body: termosVenda },
    { id: 'cookies', title: 'Política de cookies', body: politicaCookies },
  ],

  // Avaliações de compras na loja do vendedor na Shopee (src/config/reviews.ts).
  reviews,

  shareImage: '/og-13x22.png',


  // Arte do vendedor (a mesma do banner da Yampi). Os bonés do banner são ilustrativos;
  // os modelos à venda aparecem logo abaixo, com fotos reais.
  banner: {
    src: '/banner.webp',
    width: 1942,
    height: 809,
    mobileSrc: '/banner-celular.webp',
    mobileWidth: 500,
    mobileHeight: 375,
    alt: 'Vai de 13 ou 22? Escolha o seu boné. Ver modelos',
  },
}

// Descrições de venda (mesmo texto da Yampi) ligadas a cada modelo pelo par lado/modelo.
for (const side of ['13', '22'] as const) {
  for (const m of storeConfig.products[side].models) {
    m.about = (descricoes as unknown as Record<string, ModelAbout>)[`${side}/${m.id}`]
  }
}
