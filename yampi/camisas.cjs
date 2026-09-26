// Camisas Lula 13 e Bolsonaro 22: dados para a planilha da Yampi.
// Cores lidas das fotos. Tamanhos P–GG são PROVISÓRIOS (confirmar com o vendedor).
// Tecido da camisa Bolsonaro: "algodão, unissex" vem do título do anúncio de origem das fotos (confirmar).

const TAMANHOS = ['P', 'M', 'G', 'GG']

// Textos de venda: fonte única em src/config/descricoes.json (o site usa o mesmo arquivo).
const { porModelo } = require('./descricoes.cjs')
const DESCRICAO_1 = porModelo('13/camisa')
const DESCRICAO_2 = porModelo('22/camisa')

module.exports = [
  {
    lado: 13,
    slug: 'camisa-lula-13',
    nome: 'Camisa Lula 13',
    prefixo: '13-CAM',
    preco: '49.90',
    pasta: '13-camisa',
    cores: [
      ['BRANCA', 'Branca', 'branca.jpg'],
      ['MARROM', 'Marrom', 'camisa-marrom.jpg'],
      ['ROSA', 'Rosa', 'camisa-rosa.jpg'],
      ['CINZA', 'Cinza', 'cinza.jpg'],
      ['MARROMESCURO', 'Marrom escuro', 'marrom-escuro.jpg'],
      ['PRETA', 'Preta', 'preta-vermelha.jpg'],
      ['VERMELHA', 'Vermelha', 'vermelha.jpg'],
    ],
    tamanhos: TAMANHOS,
    descricao: DESCRICAO_1,
    termos:
      'camisa lula,camiseta lula,camisa do lula,camiseta do lula,camisa lula 13,camiseta lula 13,camisa 13,camiseta 13,camisa pt,camiseta pt,camisa brilha uma estrela,faz o l,camisa vermelha lula,camisa preta lula,camisa branca lula,camisa rosa lula,camisa cinza lula',
  },
  {
    lado: 22,
    slug: 'camisa-bolsonaro-22',
    nome: 'Camisa Bolsonaro 22',
    prefixo: '22-CAM',
    preco: '49.90',
    pasta: '22-camisa',
    cores: [
      ['BRANCA', 'Branca', 'branca-bombado.jpg'],
      ['PRETA', 'Preta', 'preta-bombado.jpg'],
    ],
    extras: [
      ['branca-gordinho.jpg', 'camisa-bolsonaro-geral-branca-em-uso'],
      ['preta-gordinho.jpg', 'camisa-bolsonaro-geral-preta-em-uso'],
    ],
    tamanhos: TAMANHOS,
    descricao: DESCRICAO_2,
    termos:
      'camisa bolsonaro,camiseta bolsonaro,camisa do bolsonaro,camiseta do bolsonaro,camisa bolsonaro 22,camiseta bolsonaro 22,camisa 22,camiseta 22,camisa tropa do bolsonaro,camiseta tropa do bolsonaro,camisa pl,camiseta pl,camisa verde e amarela,camisa patriota,camisa preta bolsonaro,camisa branca bolsonaro',
  },
]

module.exports.TAMANHOS = TAMANHOS
