import type { Review } from './types'

/**
 * Avaliações de compras feitas na loja do vendedor na Shopee (confirmado pelo
 * vendedor em 26/09/2026). Texto copiado sem edição; nomes mascarados (o
 * repositório é público). A Shopee não passou as notas em estrelas: sem nota,
 * a avaliação aparece sem estrelas (nunca estimar). Duas avaliações só com
 * vídeo da camisa do Lula (67bdgb9gkx e deia12723) ficaram de fora por não terem texto;
 * na camisa Bolsonaro entraram todas, a pedido do vendedor.
 */
type Entrada = Omit<Review, 'productId' | 'modelId' | 'verified' | 'origin'>
const daShopee = (productId: Review['productId'], modelId: string) => (r: Entrada): Review => ({
  productId,
  modelId,
  verified: true,
  origin: 'Shopee',
  ...r,
})
const camisaLula = daShopee('13', 'camisa')
const camisaBolsonaro = daShopee('22', 'camisa')

const obrigada = 'Obrigada pela compra, Deus abençoe. Estamos à disposição'
const obrigada2 = 'Obrigada pela compra. Deus abençoe\nEstamos à disposição'

export const reviews: Review[] = [
  camisaLula({
    author: 't*****e',
    date: '2026-09-08',
    variantLabel: 'Vermelho, M',
    details: [
      ['Conforto', 'Camiseta confortável'],
      ['Qualidade', 'Ótima qualidade'],
      ['Modelagem', 'Modelagem perfeita'],
    ],
    text: 'Comprem, não vão se arrepender 😉',
    helpful: 30,
  }),
  camisaLula({
    author: '7*****q',
    date: '2026-09-02',
    variantLabel: 'Marrom, G1',
    details: [
      ['Conforto', 'bom confortavel'],
      ['Visual sugerido', 'basico'],
      ['Estilo', 'Lula na veia'],
    ],
    text: 'Bom\nMaterial bom e linda a camisa 👚 quero comprar uma de cada cor',
    helpful: 15,
  }),
  camisaLula({
    author: 'h*****k',
    date: '2026-08-26',
    variantLabel: 'Marrom, GG',
    details: [
      ['Qualidade', 'ótimo leve'],
      ['Ocasião adequada', 'festa política'],
      ['Visual sugerido', 'amei bem confortável do jeito do anúncio'],
    ],
    text: 'Comprei o tamanho que uso e deu certo',
    helpful: 10,
  }),
  camisaLula({
    author: 's*****n',
    date: '2026-09-10',
    variantLabel: 'Vermelho, G',
    details: [
      ['Conforto', 'a camisa é ótima'],
      ['Qualidade', 'a qualidade pelo valor é boa'],
      ['Modelagem', 'o tamanho g deu certinho eu peso 79kg e ficou super confortavel'],
    ],
    helpful: 2,
  }),
  camisaLula({
    author: 'k*****0',
    date: '2026-09-10',
    variantLabel: 'Vermelho, M',
    details: [
      ['Conforto', 'pano maravilhoso'],
      ['Qualidade', 'boa'],
      ['Modelagem', 'perfeito'],
    ],
    helpful: 9,
  }),
  camisaLula({
    author: 'm*****1',
    date: '2026-09-01',
    variantLabel: 'Vermelho, M',
    details: [
      ['Qualidade', 'A qualidade é muito boa, pode comprar sem medo'],
      ['Conforto', 'Muito confortavel'],
      ['Custo-benefício', 'Magnifico'],
    ],
    helpful: 1,
  }),
  camisaLula({
    author: 'p*****a',
    date: '2026-08-10',
    variantLabel: 'Vermelho, G',
    text:
      'Uma das blusas veio correta!\nA que era tamanho pp, arrancaram a etiqueta e mandaram uma bem maior!\nVocês pensam que o consumidor é burro!\nMais honesto seria admitir o erro!',
    sellerReply:
      'Bom dia, se uma das blusas foi correta maravilha. O seu pedido foi de justamente UMA blusa, a outra foi cortesia! Se eu soubesse que geraria esse descontentamento e a má avaliação, eu teria enviado apenas UMA que foi a que você pagou. De qualquer forma, obrigado pela compra e desculpa ter enviado um brinde que não foi do seu agrado.',
    helpful: 9,
  }),
  camisaLula({
    author: 't*****3',
    date: '2026-08-25',
    variantLabel: 'Marrom, GG',
    details: [['Conforto', 'bom']],
  }),
  camisaLula({
    author: 'l*****2',
    date: '2026-08-21',
    variantLabel: 'Cinza, G1',
    details: [['Produto', 'Baixa qualidade']],
    text: 'Comprei no tamanho g1 para mim...tive que dar pro meu filho que usa p e quase ficou pequeno.',
    helpful: 4,
  }),
  camisaLula({
    author: 'r*****2',
    date: '2026-09-12',
    variantLabel: 'Vermelho, G1',
    details: [['Conforto', 'gostei bastante']],
  }),
  camisaLula({
    author: 'd*****r',
    date: '2026-09-05',
    variantLabel: 'Vermelho, G1',
    text: 'Top',
  }),
  camisaLula({
    author: 'a*****7',
    date: '2026-09-23',
    variantLabel: 'Vermelho, M',
    details: [
      ['Conforto', 'pano leve e fino.'],
      ['Qualidade', 'Bom.'],
      ['Modelagem', 'Excelente.'],
    ],
    text:
      'A camiseta chegou no prazo estimado, com boa condição de uso e de material bom. Vestiu bem e tem tamanho relativamente perfeito às medidas do meu corpo. Satisfeito com o pedido, super indico à loja! Satisfação imensa!! 🙌🏻🤝',
    helpful: 1,
  }),
  camisaLula({
    author: 'a*****1',
    date: '2026-09-19',
    variantLabel: 'Branco, P',
    details: [
      ['Conforto', 'levinho e macio'],
      ['Qualidade', 'costura bem feita'],
      ['Modelagem', 'veste muito bem'],
    ],
    text: 'A camisa é linda, boa impressão, costura bem feita e entrega rápida! Amei, recomendo demais!\nÉ Lula é tetraaaaaaa! ❤️⭐️🇧🇷',
    helpful: 7,
  }),
  camisaLula({
    author: '_*****_',
    date: '2026-09-18',
    variantLabel: 'Vermelho, M',
    details: [
      ['Conforto', 'Confortável'],
      ['Qualidade', 'Não é absurda, é ok pelo preço'],
      [
        'Modelagem',
        'Por ser masculina, pensei que ficaria maior (peguei M), mas gostei do caimento, se pegasse P (pensando que seria maior por ser masculina) ficaria muito justa',
      ],
    ],
    helpful: 3,
  }),
  camisaLula({
    author: 'k*****8',
    date: '2026-09-26',
    variantLabel: 'Preto, GG',
    details: [
      ['Conforto', 'malha de boa qualidade, muito confortável'],
      ['Qualidade', 'ótima qualidade do tecido e estampa'],
      ['Modelagem', 'comprei GG uso 44, 46 ficou certinha. Depende gosto da pessoa, ficou certinha nem folga nem apertada'],
    ],
  }),
  camisaLula({
    author: 'm*****5',
    date: '2026-09-19',
    variantLabel: 'Vermelho, M',
    details: [
      ['Conforto', 'otimo'],
      ['Qualidade', 'super boa'],
    ],
    text: 'Super lindo eu amei e veio de um ótimo tamanho 😊 vou comprar mais vezes',
    helpful: 5,
  }),
  camisaLula({
    author: 'j*****t',
    date: '2026-09-24',
    variantLabel: 'Vermelho, PP',
    details: [
      ['Conforto', 'macia.'],
      ['Qualidade', 'malha excelente'],
      ['Modelagem', 'perfeita'],
    ],
    text:
      'Estou muitíssimo satisfeita. Só nesta loja encontrei o meu tamanho (pp). Preço justo! A malha e a estampa são de ótima qualidade. Recomendo. E agradeço aos vendedores/as e entregadores/as.',
  }),
  camisaLula({
    author: 'b*****l',
    date: '2026-09-26',
    variantLabel: 'Vermelho, M',
    details: [
      ['Conforto', 'super confortável'],
      ['Qualidade', 'qualidade ótima, estampa perfeita e a cor vermelha lindíssima'],
      ['Modelagem', 'eu pedi tamanho M e coube perfeitamente em mim'],
    ],
  }),
  camisaLula({
    author: 'i*****e',
    date: '2026-09-22',
    variantLabel: 'Vermelho, P',
    text: 'Eu amei, material bom, chegou rápido, estampa muito boa! BORA LULA!!!! ⭐️❤️',
    helpful: 6,
  }),
  camisaLula({
    author: 'm*****1',
    date: '2026-09-19',
    variantLabel: 'Vermelho, G',
    details: [
      ['Conforto', 'tecido macio'],
      ['Qualidade', 'de ótima qualidade'],
      ['Modelagem', 'bom caimento'],
    ],
  }),
  camisaLula({
    author: 'b*****2',
    date: '2026-09-22',
    variantLabel: 'Vermelho, G1 e Vermelho, P',
    details: [
      ['Conforto', 'muito confortável'],
      ['Qualidade', 'material otimo'],
      ['Modelagem', 'boa'],
    ],
    helpful: 3,
  }),
  camisaLula({
    author: 'm*****x',
    date: '2026-09-26',
    variantLabel: 'Vermelho, GG',
    details: [
      ['Conforto', 'a camisa tem um tecido bom'],
      ['Qualidade', 'a qualidade é boa'],
      ['Modelagem', 'venho do tamanho certo'],
    ],
  }),

  // Camisa Bolsonaro 22 (enviadas pelo vendedor em 26/09/2026)
  camisaBolsonaro({
    author: 'c*****r',
    date: '2026-09-25',
    variantLabel: 'Preto, G',
    text: 'A camisa é linda 😍 tecido ótimo!👏🏻👏🏻✌🏻 Flávio Bolsonaro 22.',
  }),
  camisaBolsonaro({
    author: 'c*****r',
    date: '2026-09-25',
    variantLabel: 'Preto, P',
    text: 'Camisa linda! O tecido é ótimo! Flávio Bolsonaro 22 ✌🏻',
  }),
  camisaBolsonaro({
    author: 'j*****2',
    date: '2026-09-23',
    variantLabel: 'Branco, GG',
    text: 'Veio com tamanho muito pequeno\nPedi um GG veio parecendo um M\nNão compre e meu aviso',
  }),
  camisaBolsonaro({
    author: 'i*****a',
    date: '2026-09-15',
    variantLabel: 'Preto, G e Preto, P',
    text: 'Amei a blusa, tamanhos bons, comprei 2 G e 2 P, a P achei até um pouco grande, mas tá perfeita!\nO tecido é de qualidade, bem grossinho.',
    sellerReply: obrigada,
    helpful: 1,
  }),
  camisaBolsonaro({
    author: 'c*****1',
    date: '2025-09-11',
    variantLabel: 'Preto, GG',
    details: [['Conforto', 'chegou muito rápido custo benefício muito bom adorei 👏👏👏']],
    sellerReply: obrigada2,
    helpful: 2,
  }),
  camisaBolsonaro({ author: 'y*****4', date: '2026-09-23', variantLabel: 'Preto, G', helpful: 1 }),
  camisaBolsonaro({ author: 'd*****5', date: '2026-09-20', variantLabel: 'Preto, G2', sellerReply: obrigada }),
  camisaBolsonaro({ author: 'e*****7', date: '2026-08-27', variantLabel: 'Preto, G1', sellerReply: obrigada }),
  camisaBolsonaro({ author: 'r*****r', date: '2025-09-23', variantLabel: 'Preto, M', sellerReply: obrigada2 }),
  camisaBolsonaro({ author: 'r*****9', date: '2026-01-11', variantLabel: 'Preto, P', sellerReply: obrigada2 }),
  camisaBolsonaro({ author: 'm*****a', date: '2026-08-11', variantLabel: 'Preto, G4', sellerReply: obrigada }),
  camisaBolsonaro({ author: 'v*****l', date: '2026-08-20', variantLabel: 'Preto, G4', sellerReply: 'Obrigada pela compra, Deus abençoe, estamos à disposição' }),
  camisaBolsonaro({ author: 'd*****0', date: '2026-09-13', variantLabel: 'Branco, G3', sellerReply: 'Obrigada pela compra, Deus abençoe.\nEstamos à disposição' }),
  camisaBolsonaro({ author: 'm*****u', date: '2026-09-13', variantLabel: 'Preto, M e Preto, G', sellerReply: 'Obrigada pela compra, Deus abençoe, estamos à disposição' }),
  camisaBolsonaro({ author: 't*****l', date: '2026-09-20', variantLabel: 'Preto, G', sellerReply: obrigada }),
  camisaBolsonaro({ author: 'j*****8', date: '2026-09-22', variantLabel: 'Preto, G3' }),
  camisaBolsonaro({ author: 'i*****s', date: '2026-09-22', variantLabel: 'Preto, GG' }),
  camisaBolsonaro({ author: 'g*****u', date: '2026-09-25', variantLabel: 'Preto, M' }),
]
