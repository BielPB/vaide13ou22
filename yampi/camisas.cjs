// Camisas Lula 13 e Bolsonaro 22: dados para a planilha da Yampi.
// Cores lidas das fotos. Tamanhos P–GG são PROVISÓRIOS (confirmar com o vendedor).
// Tecido da camisa Bolsonaro: "algodão, unissex" vem do título do anúncio de origem das fotos (confirmar).

const TAMANHOS = ['P', 'M', 'G', 'GG']

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
    descricao: {
      abertura: [
        'Uma estampa com presença, feita para ser notada.',
        'A Camisa Lula 13 traz o <strong>rosto do Lula</strong> em arte de alto contraste, com o nome em destaque e a frase <strong>“Brilha uma estrela”</strong>. São sete cores para combinar do jeito que você gosta.',
      ],
      destaques: [
        '<strong>Malha 100% algodão fio 30.1</strong>: toque macio, leve e respirável, confortável o dia inteiro',
        '<strong>Gola careca em ribana com reforço</strong>, que mantém o formato',
        '<strong>Costuras reforçadas</strong>, para durar mais',
        '<strong>Modelagem unissex</strong>, com caimento moderno',
        '<strong>Estampa frontal grande</strong>, com o rosto e o nome em destaque. Na preta, a arte vem em vermelho',
      ],
      ideal: 'Para o dia a dia, encontros com os amigos, eventos e para quem gosta de mostrar o que pensa com estilo.',
      cores: 'branca, marrom, rosa, cinza, marrom escuro, preta e vermelha',
      ficha: [
        ['Tecido', '100% algodão, fio 30.1'],
        ['Modelagem', 'Unissex'],
        ['Gola', 'Redonda (careca), em ribana com reforço'],
        ['Mangas', 'Curtas'],
        ['Tamanhos', TAMANHOS.join(', ')],
        ['Medidas (referência)', 'P 50 × 70 cm · M 53 × 72 cm · G 56 × 74 cm · GG 59 × 76 cm (largura de axila a axila × comprimento do ombro à barra). Podem variar até 2 cm.'],
        ['Cuidados', 'Lavar com água fria ou morna, sem alvejante com cloro. Secar à sombra. Passar em temperatura média. Evitar secadora em alta temperatura.'],
        ['Observação', 'A cor pode variar um pouco conforme a tela.'],
      ],
    },
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
    descricao: {
      abertura: [
        'Direta, simples e com recado claro.',
        'A Camisa Bolsonaro 22 traz <strong>“Tropa do Bolsonaro”</strong> no peito, com a <strong>faixa verde e amarela</strong> logo abaixo. Tecido leve, visual limpo e caimento unissex, mostrado nas fotos em dois tipos de corpo.',
      ],
      destaques: [
        '<strong>“Tropa do Bolsonaro” em destaque</strong> no peito, com a faixa verde e amarela',
        '<strong>Estampa de alta definição</strong>, resistente a lavagens',
        '<strong>Tecido leve e de toque suave</strong>, confortável no dia a dia',
        '<strong>Modelagem unissex</strong>, com bom caimento',
        '<strong>Costura reforçada</strong>, para durar mais',
      ],
      ideal: 'Para o dia a dia, passeios, encontros com os amigos, eventos e para quem gosta de mostrar o que pensa com estilo.',
      cores: 'branca e preta',
      ficha: [
        ['Tecido', '100% algodão'],
        ['Estampa', 'Frontal, de alta definição'],
        ['Modelagem', 'Unissex'],
        ['Gola', 'Redonda'],
        ['Mangas', 'Curtas'],
        ['Tamanhos', TAMANHOS.join(', ')],
        ['Medidas (referência)', 'P 50 × 70 cm · M 53 × 72 cm · G 56 × 74 cm · GG 59 × 76 cm (largura de axila a axila × comprimento do ombro à barra). Podem variar até 2 cm.'],
        ['Cuidados', 'Lavar com água fria ou morna, sem alvejante com cloro. Secar à sombra. Passar em temperatura média. Evitar secadora em alta temperatura.'],
      ],
    },
    termos:
      'camisa bolsonaro,camiseta bolsonaro,camisa do bolsonaro,camiseta do bolsonaro,camisa bolsonaro 22,camiseta bolsonaro 22,camisa 22,camiseta 22,camisa tropa do bolsonaro,camiseta tropa do bolsonaro,camisa pl,camiseta pl,camisa verde e amarela,camisa patriota,camisa preta bolsonaro,camisa branca bolsonaro',
  },
]

module.exports.TAMANHOS = TAMANHOS
