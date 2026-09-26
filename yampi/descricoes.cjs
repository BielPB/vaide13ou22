// Descrições de venda dos produtos (fonte única para a planilha da Yampi e para descricoes.html).
// Regras: só características confirmadas pelo vendedor ou visíveis nas fotos; sem "oficial",
// sem "Seleção Brasileira", sem pedido de voto; tom comercial.

/** Liga a frase "Leve 2 ou mais..." nas descrições. Só true com o desconto funcionando no checkout. */
const OFERTA_2_MAIS_ATIVA = false

const strapback22 = {
  fechamento: 'Regulagem traseira tipo fitão (strapback)',
  tamanho: 'Único, regulável',
}

module.exports = [
  {
    slug: 'bone-nome-lula-estrela',
    abertura: [
      'Tem boné que só completa o visual. E tem boné que fala por você.',
      'O Nome Lula traz o <strong>LULA com a estrela</strong> em destaque na frente, num modelo trucker que fica leve na cabeça e combina com o jeito de vestir do dia a dia.',
    ],
    destaques: [
      '<strong>Estampa frontal em DTF</strong>, com cores vivas e bem definidas',
      '<strong>Tela atrás</strong> que deixa o ar circular, para usar por horas sem abafar',
      '<strong>Fecho ajustável</strong> atrás, para encaixar do jeito certo',
      '<strong>Aba curva</strong>, no estilo clássico do trucker',
    ],
    ideal: 'Para o dia a dia, encontros com os amigos, eventos e para quem gosta de mostrar o que pensa com estilo.',
    cores: 'vermelho, preto, branco e branco com preto',
    preco2: 'R$ 39,90',
    ficha: [['Modelo', 'Trucker com tela'], ['Estampa', 'DTF na frente'], ['Fechamento', 'Ajustável atrás']],
  },
  {
    slug: 'bone-numero-13',
    abertura: [
      'Direto ao ponto: o <strong>13 grande na frente</strong>, sem rodeio.',
      'Um trucker de visual forte, feito para ser visto de longe. O vermelho vem com o número em branco e o preto, com o número em vermelho: dois jeitos de usar o mesmo recado.',
    ],
    destaques: [
      '<strong>Número 13 em destaque</strong>, visível de longe',
      '<strong>Tela atrás</strong> que deixa o ar circular',
      '<strong>Aba curva</strong>, no estilo clássico do trucker',
      'Duas combinações de cor com <strong>alto contraste</strong>',
    ],
    ideal: 'Para quem prefere um visual marcante e sem excesso de informação, no dia a dia ou em ocasiões especiais.',
    cores: 'vermelho (número branco) e preto (número vermelho)',
    preco2: 'R$ 39,90',
    ficha: [['Modelo', 'Trucker com tela']],
  },
  {
    slug: 'bone-nome-lula-letras',
    abertura: [
      'Letras grandes, leitura fácil, recado claro.',
      'O Nome Lula traz o <strong>LULA em letras grandes</strong> na frente de um trucker de linhas simples. São quatro combinações de cor, do vermelho clássico ao preto discreto.',
    ],
    destaques: [
      '<strong>LULA em letras grandes</strong>, legível de longe',
      '<strong>Tela atrás</strong> que deixa o ar circular',
      '<strong>Aba curva</strong>, no estilo clássico do trucker',
      '<strong>Quatro combinações de cor</strong> para escolher a que mais combina com você',
    ],
    ideal: 'Para usar no dia a dia, com os amigos ou em eventos, com um visual que chama atenção.',
    cores: 'vermelho, branco, branco com vermelho e preto',
    preco2: 'R$ 39,90',
    ficha: [['Modelo', 'Trucker com tela']],
  },
  {
    slug: 'bone-simples-vermelho',
    abertura: [
      'O básico que nunca sai de moda.',
      'Boné <strong>liso, em vermelho</strong>, sem aplicação na frente: a cor fala por si. Combina com camiseta, jaqueta, bermuda ou jeans, e vai do rolê ao trabalho sem esforço.',
    ],
    destaques: [
      '<strong>Liso</strong>, sem estampa ou bordado na frente',
      '<strong>Vermelho</strong> marcante e fácil de combinar',
      '<strong>Aba curva</strong> no estilo tradicional',
    ],
    ideal: 'Para quem quer a cor sem nenhuma mensagem, ou um boné coringa para o dia a dia.',
    cores: 'vermelho',
    preco2: 'R$ 37,90',
    ficha: [['Modelo', 'Tradicional, liso']],
  },
  {
    slug: 'bone-trucker-liso',
    abertura: [
      'Discreto, versátil e com cara de clássico.',
      'Um <strong>trucker preto, sem estampa</strong>, com tela atrás. É o boné que combina com tudo e nunca fica fora de lugar.',
    ],
    destaques: [
      '<strong>Preto liso</strong>, sem estampa',
      '<strong>Tela atrás</strong> que deixa o ar circular',
      '<strong>Aba curva</strong>, no estilo clássico do trucker',
    ],
    ideal: 'Para o dia a dia, para o trabalho ou como segunda opção no guarda-roupa.',
    cores: 'preto',
    preco2: 'R$ 37,90',
    ficha: [['Modelo', 'Trucker com tela'], ['Estampa', 'Sem estampa']],
  },
  {
    slug: 'bone-nome-e-bandeira',
    abertura: [
      'Verde, amarelo e muito Brasil, sem precisar de exagero.',
      'O Nome e bandeira traz a palavra <strong>BRASIL</strong> com a <strong>bandeira do Brasil</strong> na frente. São cinco cores para você escolher a sua, do azul ao branco.',
    ],
    destaques: [
      '<strong>BRASIL e bandeira</strong> em destaque na frente',
      '<strong>Regulagem tipo fitão</strong>: ajusta a diferentes tamanhos de cabeça',
      '<strong>Costura reforçada</strong>, feita para o uso de todo dia',
      '<strong>Leve e ventilado</strong>, confortável o dia inteiro',
      '<strong>Boa fixação de cor</strong>, que continua bonita com o uso frequente',
      '<strong>Aba curva</strong>, que protege o rosto do sol',
    ],
    ideal: 'Para o dia a dia, viagens, dias de jogo do Brasil e para quem gosta de vestir as cores do país.',
    cores: 'azul, preto, verde, amarelo e branco',
    preco2: 'R$ 39,90',
    ficha: [['Fechamento', strapback22.fechamento], ['Tamanho', strapback22.tamanho]],
  },
  {
    slug: 'bone-simples',
    abertura: [
      'O básico bem feito, em azul ou verde.',
      'Boné <strong>liso</strong>, sem aplicação na frente, para quem quer cor sem informação demais. Fácil de combinar e perfeito para o dia a dia.',
    ],
    destaques: [
      '<strong>Liso</strong>, sem estampa ou bordado na frente',
      '<strong>Duas cores</strong>: azul e verde',
      '<strong>Aba curva</strong> no estilo tradicional',
    ],
    ideal: 'Para quem quer um boné coringa, que vai bem com qualquer roupa.',
    cores: 'azul e verde',
    preco2: 'R$ 29,90',
    ficha: [['Modelo', 'Tradicional, liso']],
  },
  {
    slug: 'bone-camuflado',
    abertura: [
      'Visual militar, atitude de sobra.',
      'O Camuflado traz o <strong>patch da bandeira do Brasil</strong> na frente e o estilo tático que combina tanto com a trilha quanto com a cidade. Tem em preto, verde-oliva e camuflado.',
    ],
    destaques: [
      '<strong>Patch da bandeira do Brasil</strong> na frente',
      '<strong>Poliéster resistente</strong>, feito para o uso do dia a dia',
      '<strong>Fecho com fivela e ilhós</strong>: ajuste firme, tamanho único e unissex',
      '<strong>Visor rígido e aba curva</strong>, que mantêm o formato e protegem do sol',
      '<strong>Forro interno macio e faixa que absorve o suor</strong>, confortável até nos dias quentes',
    ],
    ideal: 'Para trilhas, pesca, acampamento, airsoft e para quem curte o estilo tático no dia a dia.',
    cores: 'preto, verde-oliva e camuflado',
    preco2: 'R$ 49,90',
    ficha: [['Tecido', 'Poliéster'], ['Fechamento', 'Fivela e ilhós atrás'], ['Tamanho', 'Único, regulável'], ['Uso', 'Unissex']],
  },
  {
    slug: 'bone-flavio-bolsonaro',
    abertura: [
      'Um trucker com nome e sobrenome.',
      'O boné Flávio Bolsonaro traz o nome em destaque na frente, com faixas coloridas logo abaixo, num trucker com tela atrás que fica leve na cabeça. São quatro cores: preto, amarelo, azul e verde.',
    ],
    destaques: [
      '<strong>“Flávio Bolsonaro” em destaque</strong> na frente',
      '<strong>Tela atrás</strong> que deixa o ar circular: leve e ventilado',
      '<strong>Regulagem tipo fitão</strong>: ajusta a diferentes tamanhos de cabeça',
      '<strong>Costura reforçada</strong>, feita para o uso de todo dia',
      '<strong>Boa fixação de cor</strong>, que continua bonita com o uso frequente',
      '<strong>Aba curva</strong>, no estilo clássico do trucker',
    ],
    ideal: 'Para o dia a dia, encontros com os amigos, eventos e para quem gosta de mostrar o que pensa com estilo.',
    cores: 'preto, amarelo, azul e verde',
    preco2: 'R$ 32,90',
    ficha: [['Modelo', 'Trucker com tela'], ['Fechamento', strapback22.fechamento], ['Tamanho', strapback22.tamanho]],
  },
]

/** HTML aceito pelo campo "descricao" da Yampi. */
module.exports.toHtml = (d) =>
  [
    ...d.abertura.map((p) => `<p>${p}</p>`),
    '<p><strong>Destaques</strong></p>',
    `<ul>${d.destaques.map((x) => `<li>${x}</li>`).join('')}</ul>`,
    `<p><strong>Quando usar:</strong> ${d.ideal}</p>`,
    `<p><strong>Cores disponíveis:</strong> ${d.cores}.</p>`,
    // Oferta de 2+ só volta quando o desconto existir de verdade no checkout da Yampi
    // (cupons/faixas não liberados no plano atual).
    OFERTA_2_MAIS_ATIVA ? `<p><strong>Leve 2 ou mais da mesma cor e pague ${d.preco2} cada.</strong></p>` : '',
    d.ficha.length ? `<p><strong>Ficha técnica</strong><br>${d.ficha.map(([k, v]) => `${k}: ${v}`).join('<br>')}</p>` : '',
  ].join('')
