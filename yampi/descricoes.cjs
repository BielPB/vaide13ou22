// Descrições de venda dos BONÉS para a Yampi.
// Fonte única: src/config/descricoes.json (o site usa o mesmo arquivo). Edite lá.
// Regras: só características confirmadas pelo vendedor ou visíveis nas fotos; sem "oficial",
// sem "Seleção Brasileira", sem pedido de voto; tom comercial.

const data = require('../src/config/descricoes.json')

/** Liga a frase "Leve 2 ou mais..." nas descrições. Só true com o desconto funcionando no checkout. */
const OFERTA_2_MAIS_ATIVA = false

/** **negrito** → <strong>negrito</strong> */
const html = (s) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

const toYampi = (d) => ({
  slug: d.slug,
  abertura: d.abertura.map(html),
  destaques: d.destaques.map(html),
  ideal: d.quandoUsar,
  cores: d.cores,
  ficha: d.ficha,
})

module.exports = Object.values(data)
  .filter((d) => d.slug.startsWith('bone-'))
  .map(toYampi)

/** Descrição de um modelo pela chave do site (ex.: '13/camisa'), no formato da Yampi. */
module.exports.porModelo = (chave) => {
  const d = data[chave]
  if (!d) throw new Error('sem descrição para ' + chave)
  return toYampi(d)
}

/** HTML aceito pelo campo "descricao" da Yampi. */
module.exports.toHtml = (d) =>
  [
    ...d.abertura.map((p) => `<p>${p}</p>`),
    '<p><strong>Destaques</strong></p>',
    `<ul>${d.destaques.map((x) => `<li>${x}</li>`).join('')}</ul>`,
    `<p><strong>Quando usar:</strong> ${d.ideal}</p>`,
    `<p><strong>Cores disponíveis:</strong> ${d.cores}.</p>`,
    OFERTA_2_MAIS_ATIVA && d.preco2 ? `<p><strong>Leve 2 ou mais da mesma cor e pague ${d.preco2} cada.</strong></p>` : '',
    d.ficha.length ? `<p><strong>Ficha técnica</strong><br>${d.ficha.map(([k, v]) => `${k}: ${v}`).join('<br>')}</p>` : '',
  ].join('')
