import type { Product, ProductImage, ProductModel } from './types'

/**
 * Seção Alfaiataria (roupas masculinas da loja do vendedor que vende para fora;
 * cadastrada a pedido dele em 28/09/2026). DESLIGADA (`enabled: false`): não aparece
 * na vitrine, no menu, nas rotas nem nas páginas geradas no build.
 *
 * Antes de ligar, falta: os Links de compra da Yampi de cada tamanho/cor
 * (`checkoutUrl`). Os preços em reais estão em `precoDe`, abaixo. O tênis da
 * planilha ficou de fora (fotos de réplica de marca).
 *
 * Roupas usam `category: 'camisa'`: o site trata como peça com tamanho (seletor de
 * tamanho, tabela de medidas e nome sem o prefixo "Boné").
 */

const photo = (src: string, label: string, alt: string, width: number, height: number): ProductImage => ({
  src: `/produtos/alfaiataria/${src}`,
  label,
  alt,
  width,
  height,
  illustrative: false,
})

/** Uma variação de cor + tamanho, ainda sem Link de compra. */
const peca = (color: string, label: string, size: string, image: string) => ({
  id: `${color}-${size.toLowerCase()}`,
  label,
  size,
  stock: null,
  available: true,
  image: `/produtos/alfaiataria/${image}`,
  checkoutUrl: null,
})

const TAM_CALCA = ['38', '40', '42', '44', '46', '48', '50', '52']
const TAM_ROUPA = ['P', 'M', 'G', 'GG']

/** Tabela das calças de alfaiataria, informada pelo vendedor (cintura × comprimento). */
const medidasCalca: Array<[string, string]> = [
  ['38', 'Cintura 39,5 cm · Comprimento 98 cm'],
  ['40', 'Cintura 42 cm · Comprimento 99,5 cm'],
  ['42', 'Cintura 44 cm · Comprimento 100 cm'],
  ['44', 'Cintura 46 cm · Comprimento 101 cm'],
  ['46', 'Cintura 48 cm · Comprimento 100,5 cm'],
  ['48', 'Cintura 49 cm · Comprimento 103,5 cm'],
  ['50', 'Cintura 52 cm · Comprimento 105 cm'],
  ['52', 'Cintura 54 cm · Comprimento 106,5 cm'],
]
const notaCalca = 'Medidas da peça: cintura (de lado a lado, com a calça fechada) e comprimento. O modelo das fotos veste 40, tem 1,76 m e 79 kg.'

/** Calça de uma cor só, em todos os tamanhos. */
function calca(
  id: string,
  name: string,
  pasta: string,
  cor: [string, string],
  fotos: number,
  alt: string,
  specs: Partial<ProductModel['specs']>,
): ProductModel {
  const [corId, corNome] = cor
  return {
    id,
    name,
    category: 'camisa',
    description: null,
    priceCents: null,
    tiers: [],
    images: Array.from({ length: fotos }, (_, i) =>
      photo(`${pasta}/${i + 1}.webp`, i === 0 ? corNome : `${corNome} · foto ${i + 1}`, `${alt}${i === 0 ? '' : `, foto ${i + 1}`}`, 675, 900),
    ),
    variants: TAM_CALCA.map((t) => peca(corId, corNome, t, `${pasta}/1.webp`)),
    specs: { material: null, closure: null, measurements: null, care: null, highlights: [], ...specs },
  }
}

const calcaTecido = { material: '98% algodão e 2% elastano', measurements: medidasCalca, measurementsNote: notaCalca }

const models: ProductModel[] = [
  calca('calca-capri', 'Calça de Alfaiataria Capri com Ajuste Lateral', 'calca-de-alfaiataria-capri-ajuste-lateral', ['azul-marinho', 'Azul-marinho'], 4, 'Calça de alfaiataria Capri azul-marinho, com ajuste lateral', {
    ...calcaTecido,
    highlights: ['Ajuste lateral na cintura, com fivela.', 'Tecido com elastano: macio, resistente e com elasticidade.', 'Corte que valoriza a silhueta, para looks casuais ou mais arrumados.'],
  }),
  calca('calca-santorini', 'Calça de Alfaiataria Santorini com Ajuste Lateral', 'calca-de-alfaiataria-santorin-ajuste-lateral', ['preto', 'Preto'], 4, 'Calça de alfaiataria Santorini preta, com ajuste lateral', {
    ...calcaTecido,
    highlights: ['Ajuste lateral na cintura, com fivela.', 'Tecido com elastano: macio, resistente e com elasticidade.', 'Preta, fácil de combinar do casual ao social.'],
  }),
  calca('calca-firenze', 'Calça de Sarja Firenze com Ajuste Lateral', 'calca-de-sarja-firenze-ajuste-lateral', ['cinza-claro', 'Cinza-claro'], 3, 'Calça de sarja Firenze cinza-claro, com ajuste lateral', {
    ...calcaTecido,
    highlights: ['Ajuste lateral na cintura.', 'Tecido com elastano: macio, resistente e com elasticidade.', 'Cinza-claro, para looks leves e elegantes.'],
  }),
  calca('calca-florence', 'Calça de Alfaiataria Florence', 'calca-de-alfaiataria-florence', ['grafite', 'Grafite'], 3, 'Calça de alfaiataria Florence grafite', {
    ...calcaTecido,
    highlights: ['Tecido com elastano: macio, resistente e com elasticidade.', 'Grafite com textura discreta.', 'Corte que valoriza a silhueta.'],
  }),
  calca('calca-soufter', 'Calça de Sarja Soufter', 'calca-de-sarja-soufter', ['azul-marinho', 'Azul-marinho'], 3, 'Calça de sarja Soufter azul-marinho', {
    material: 'Sarja',
    highlights: ['Sarja resistente e de toque macio.', 'Corte moderno, que valoriza a silhueta.', 'Para looks casuais, urbanos ou mais arrumados.'],
  }),
  {
    id: 'sueter-san-victorio',
    name: "Suéter de Tricô San'Victorio",
    category: 'camisa',
    description: null,
    priceCents: null,
    tiers: [],
    images: [
      photo('sueter-tricot-sanvictorio/1.webp', 'Azul-marinho', "Suéter de tricô San'Victorio azul-marinho, com meio zíper", 713, 713),
      photo('sueter-tricot-sanvictorio/2.webp', 'Azul-marinho · em uso', "Modelo usando o suéter San'Victorio azul-marinho", 713, 713),
      photo('sueter-tricot-sanvictorio/3.webp', 'Detalhe do zíper', "Detalhe da gola com meio zíper do suéter San'Victorio", 713, 713),
      photo('sueter-tricot-sanvictorio/4.webp', 'Detalhe do tricô', "Detalhe do tricô do suéter San'Victorio", 713, 713),
    ],
    variants: TAM_ROUPA.map((t) => peca('azul-marinho', 'Azul-marinho', t, 'sueter-tricot-sanvictorio/1.webp')),
    specs: {
      material: 'Algodão',
      closure: null,
      measurements: null,
      care: null,
      highlights: ['Gola alta com meio zíper.', 'Tricô de algodão, bom para os dias de meia-estação.', 'Estilo clássico, fácil de usar por cima de camisa.'],
    },
  },
  {
    id: 'sueter-dicaprio',
    name: 'Suéter de Tricô Dicaprio',
    category: 'camisa',
    description: null,
    priceCents: null,
    tiers: [],
    images: [
      photo('sueter-tricot-dicaprio/1.webp', 'Azul-marinho', 'Suéter de tricô Dicaprio azul-marinho, com meio zíper', 713, 713),
      photo('sueter-tricot-dicaprio/2.webp', 'Preto', 'Suéter de tricô Dicaprio preto, com meio zíper', 713, 713),
      photo('sueter-tricot-dicaprio/3.webp', 'Azul-celeste', 'Suéter de tricô Dicaprio azul-celeste, com meio zíper', 713, 713),
      photo('sueter-tricot-dicaprio/4.webp', 'Cinza', 'Suéter de tricô Dicaprio cinza, com meio zíper', 713, 713),
      photo('sueter-tricot-dicaprio/5.webp', 'Cinza · costas', 'Costas do suéter Dicaprio cinza', 713, 713),
      photo('sueter-tricot-dicaprio/6.webp', 'Detalhe do zíper', 'Detalhe da gola com meio zíper do suéter Dicaprio', 713, 713),
      photo('sueter-tricot-dicaprio/7.webp', 'Detalhe do punho', 'Detalhe do punho canelado do suéter Dicaprio', 713, 713),
      photo('sueter-tricot-dicaprio/8.webp', 'Detalhe da gola', 'Detalhe da gola do suéter Dicaprio', 713, 713),
    ],
    variants: [
      ['azul-marinho', 'Azul-marinho', 1],
      ['azul-celeste', 'Azul-celeste', 3],
      ['preto', 'Preto', 2],
      ['cinza', 'Cinza', 4],
    ].flatMap(([id, label, foto]) => TAM_ROUPA.map((t) => peca(String(id), String(label), t, `sueter-tricot-dicaprio/${foto}.webp`))),
    specs: {
      material: 'Algodão',
      closure: null,
      measurements: null,
      care: null,
      highlights: ['Gola alta com meio zíper.', 'Tricô de algodão, com punhos e barra canelados.', 'Quatro cores: azul-marinho, azul-celeste, preto e cinza.'],
    },
  },
  {
    id: 'camisa-san-tropez',
    name: "Camisa San'Tropez Texturizada",
    category: 'camisa',
    description: null,
    priceCents: null,
    tiers: [],
    images: [
      photo('camisa-gola-alta-tricot/1.webp', 'Branco', "Camisa San'Tropez texturizada branca, de manga curta", 675, 900),
      photo('camisa-gola-alta-tricot/3.webp', 'Preto', "Camisa San'Tropez texturizada preta, de manga curta", 675, 900),
      photo('camisa-gola-alta-tricot/2.webp', 'Branco · detalhe', "Detalhe da textura da camisa San'Tropez branca", 675, 900),
      photo('camisa-gola-alta-tricot/4.webp', 'Preto · em uso', "Modelo usando a camisa San'Tropez preta", 675, 900),
      photo('camisa-gola-alta-tricot/5.webp', 'Branco · em uso', "Modelo usando a camisa San'Tropez branca", 675, 900),
    ],
    variants: [
      ['branco', 'Branco', 1],
      ['preto', 'Preto', 3],
    ].flatMap(([id, label, foto]) => TAM_ROUPA.map((t) => peca(String(id), String(label), t, `camisa-gola-alta-tricot/${foto}.webp`))),
    specs: {
      material: null,
      closure: null,
      measurements: null,
      care: null,
      highlights: ['Tecido texturizado, com personalidade.', 'Manga curta, gola aberta e botões.', 'Do casual ao arrumado, em branco ou preto.'],
    },
  },
  {
    id: 'polo-texturizada',
    name: 'Camisa Polo de Tricô Texturizada',
    category: 'camisa',
    description: null,
    priceCents: null,
    tiers: [],
    images: [
      photo('camisa-texturizada/1.webp', 'Branco', 'Camisa polo de tricô texturizada branca', 400, 615),
      photo('camisa-texturizada/5.webp', 'Preto', 'Camisa polo de tricô texturizada preta', 585, 900),
      photo('camisa-texturizada/2.webp', 'Branco · em uso', 'Modelo usando a camisa polo branca com calça azul-marinho', 585, 900),
      photo('camisa-texturizada/3.webp', 'Branco · detalhe', 'Detalhe da textura da camisa polo branca', 585, 900),
      photo('camisa-texturizada/4.webp', 'Branco · costas', 'Costas da camisa polo branca', 585, 900),
      photo('camisa-texturizada/6.webp', 'Preto · em uso', 'Modelo usando a camisa polo preta com calça clara', 585, 900),
      photo('camisa-texturizada/7.webp', 'Preto · detalhe', 'Detalhe da gola e da textura da camisa polo preta', 585, 900),
      photo('camisa-texturizada/8.webp', 'Preto · costas', 'Costas da camisa polo preta', 585, 900),
    ],
    variants: [
      ['branco', 'Branco', 1],
      ['preto', 'Preto', 5],
    ].flatMap(([id, label, foto]) => TAM_ROUPA.map((t) => peca(String(id), String(label), t, `camisa-texturizada/${foto}.webp`))),
    specs: {
      material: null,
      closure: null,
      measurements: null,
      care: null,
      highlights: ['Tricô texturizado com nervuras verticais.', 'Gola polo e manga curta.', 'Combina com calça de alfaiataria ou jeans.'],
    },
  },
  {
    id: 'sueter-britanico',
    name: 'Suéter Britânico Texturizado',
    category: 'camisa',
    description: null,
    priceCents: null,
    tiers: [],
    // A foto 7 da loja de fora (etiqueta de outra marca) ficou de fora.
    images: [
      photo('sueter-britanico-texturizado/1.webp', 'Branco', 'Modelo usando o suéter britânico texturizado branco', 400, 615),
      photo('sueter-britanico-texturizado/2.webp', 'Branco · look', 'Modelo com o suéter britânico branco e calça verde', 585, 900),
      photo('sueter-britanico-texturizado/3.webp', 'Branco · detalhe', 'Detalhe do tricô trançado do suéter britânico', 585, 900),
      photo('sueter-britanico-texturizado/4.webp', 'Branco · lateral', 'Lateral do suéter britânico branco', 585, 900),
      photo('sueter-britanico-texturizado/5.webp', 'Branco · costas', 'Costas do suéter britânico branco', 585, 900),
      photo('sueter-britanico-texturizado/6.webp', 'Branco · ao ar livre', 'Suéter britânico branco pendurado numa cerca, ao ar livre', 585, 900),
    ],
    variants: TAM_ROUPA.map((t) => peca('branco', 'Branco', t, 'sueter-britanico-texturizado/1.webp')),
    specs: {
      material: null,
      closure: null,
      measurements: null,
      care: null,
      highlights: ['Tricô trançado, com textura marcante.', 'Gola redonda.', 'Clássico para os dias frios.'],
    },
  },
  {
    id: 'regata-canelada',
    name: 'Regata Canelada',
    category: 'camisa',
    description: null,
    priceCents: null,
    tiers: [],
    images: [
      photo('camiseta-canelada-masculina/1.webp', 'Preto', 'Modelo usando a regata canelada preta', 675, 900),
      photo('camiseta-canelada-masculina/2.webp', 'Branco', 'Modelo usando a regata canelada branca', 675, 900),
      photo('camiseta-canelada-masculina/3.webp', 'Preto · look', 'Regata canelada preta com calça marrom', 675, 900),
      photo('camiseta-canelada-masculina/4.webp', 'Preto · look', 'Regata canelada preta com bermuda clara', 675, 900),
      photo('camiseta-canelada-masculina/5.webp', 'Preto · detalhe', 'Detalhe do canelado da regata preta', 675, 900),
      photo('camiseta-canelada-masculina/6.webp', 'Preto · costas', 'Costas da regata canelada preta', 675, 900),
      photo('camiseta-canelada-masculina/7.webp', 'Preto · em uso', 'Modelo usando a regata canelada preta ao ar livre', 675, 900),
      photo('camiseta-canelada-masculina/8.webp', 'Branco · look', 'Regata canelada branca com calça caramelo', 675, 900),
      photo('camiseta-canelada-masculina/9.webp', 'Branco · look', 'Regata canelada branca com bermuda clara', 675, 900),
      photo('camiseta-canelada-masculina/10.webp', 'Branco · costas', 'Costas da regata canelada branca', 675, 900),
    ],
    variants: [
      ['preto', 'Preto', 1],
      ['branco', 'Branco', 2],
    ].flatMap(([id, label, foto]) => TAM_ROUPA.map((t) => peca(String(id), String(label), t, `camiseta-canelada-masculina/${foto}.webp`))),
    specs: {
      material: 'Algodão canelado',
      closure: null,
      measurements: null,
      care: null,
      highlights: ['Algodão canelado, leve e fresco.', 'Ajuste ao corpo, sem perder o conforto.', 'Para academia, lazer ou looks casuais.'],
    },
  },
]

/**
 * Preços em reais informados pelo vendedor em 28/09/2026: [de, por], em centavos.
 * Os mesmos da planilha da Yampi (preco_venda = de, preco_promocional = por).
 */
const precoDe = (m: ProductModel): [number, number] =>
  m.id.startsWith('calca') ? [42700, 18790] : m.id.startsWith('sueter') ? [39700, 29790] : m.id === 'regata-canelada' ? [19990, 12790] : [23590, 18990]
for (const m of models) {
  const [de, por] = precoDe(m)
  m.priceCents = por
  m.compareAtCents = de
  m.compareAtSource = 'Preço "de" informado pelo vendedor em 28/09/2026 (igual ao da planilha da Yampi)'
}

export const alfaiataria: Product = {
  id: 'alfaiataria',
  number: '',
  shortName: 'Alfaiataria',
  name: 'Alfaiataria',
  tagline: 'Calças de alfaiataria e sarja, suéteres de tricô, camisas e regata.',
  heroImage: photo('calca-de-alfaiataria-capri-ajuste-lateral/1.webp', 'Capri · Azul-marinho', 'Calça de alfaiataria Capri azul-marinho', 675, 900),
  models,
  // Desligada até ter os Links de compra da Yampi.
  enabled: false,
}
