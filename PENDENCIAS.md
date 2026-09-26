# Pendências para publicação

A loja **não está pronta para vender**. Enquanto os itens essenciais não forem preenchidos, a compra fica bloqueada automaticamente.
A lista atualizada também aparece no rodapé da prévia, calculada a partir de `src/config/store.ts`.

## Já recebido

- **Loja:** vaide13ou22 · **WhatsApp:** (21) 96952-6716
- **Endereço:** Sítio Côrrego de Santo Antônio, 998 – Côrrego de Santo Antonio, Barra Alegre – RJ, CEP 28666-971 (o link do Maps é uma busca por esse endereço).
- **Oferta:** frete grátis em compras acima de R$ 149,90 (faixa no topo, resumo do pedido, Entrega e FAQ).
- **Lado 22:** 4 modelos com fotos e preços. O preço de 2 ou mais vale para a **mesma cor** (mesma variação).
  Nome e bandeira R$ 47,90 / R$ 39,90 · Simples R$ 35,90 / R$ 29,90 · Camuflado R$ 59,90 / R$ 49,90 · Flávio Bolsonaro R$ 37,90 / R$ 32,90.
- **Fotos:** confirmadas pelo vendedor como fiéis ao produto.
- **Fichas:** Nome e bandeira e Flávio Bolsonaro com regulagem fitão/strapback e tamanho único. Camuflado em poliéster, com fivela e ilhós.
- **Lado 13:** 5 modelos com fotos. Nome Lula (estrela), Número 13 e Nome Lula (letras grandes): R$ 45,90 / R$ 39,90. Simples vermelho e Trucker liso: R$ 39,90 / R$ 37,90 (2+ da mesma cor).
- **Checkout Yampi ligado:** 63 Links de compra conferidos abrindo cada link (27 cores de bonés + 36 cor×tamanho de camisas); domínio `vai-de-13-ou-22.pay.yampi.com.br`.
- **Camisas:** Camisa Lula 13 (7 cores) e Camisa Bolsonaro 22 (2 cores), R$ 49,90, tamanhos P, M, G, GG (iguais aos da Yampi).

## Essenciais: bloqueiam a venda

| Chave | O que falta | Onde preencher |
|---|---|---|
| `MATERIAL` | Tecido do Nome e bandeira, do Flávio Bolsonaro, do Simples e dos 5 modelos do 13 | `models[].specs.material` |
| `FECHAMENTO` · `MEDIDAS` | Ficha do Simples (13 e 22) e dos modelos do 13 | `models[].specs` |
| — | Peso e dimensões da embalagem (a Yampi precisa para calcular o frete) | Cadastro na Yampi |
| `VARIANTES` | Confirmar as cores de cada modelo (lidas das fotos), nos dois lados | `products.*.models` |
| `IDENTIFICACAO_DO_VENDEDOR` | Confirmar a declaração de loja independente | `store.independence.confirmed` |
| `CONDICOES_DE_FRETE` | Regras de frete e área de entrega | `commerce.shipping` |
| `PAGAMENTOS` | Formas aceitas, como aparecem no checkout da Yampi | `commerce.payments` |
| `POLITICAS` | Trocas e devoluções (resumo e texto), privacidade e termos | `commerce.returns`, `policies` |

## Aviso legal: identificação do vendedor

Por decisão do vendedor, o site **não mostra** nome completo nem CPF/CNPJ, só o endereço.
O Decreto 7.962/2013 (art. 2º) pede que sites de venda exibam nome ou razão social, CPF/CNPJ e endereço físico.
Isso fica registrado como aviso e não bloqueia a página. Para cumprir o decreto, preencha `store.legalName` e `store.documentId`.

## Na Yampi (antes de publicar)

| O que | Por quê |
|---|---|
| **Desconto de 2+** | Pausado: o plano da Yampi não libera cupons/faixas. A loja vende pelo preço de 1 unidade. Para reativar: plano com cupons → criar os 6 cupons (ver histórico) → testar → `quantityDiscountActive: true` e `OFERTA_2_MAIS_ATIVA = true`. |
| **Renomear os dois "Boné Nome Lula"** | No checkout, os modelos estrela e letras grandes aparecem com o mesmo nome. Sugestão: "Boné Nome Lula (estrela)" e "Boné Nome Lula (letras grandes)", iguais ao site. |
| **Foto do Camuflado Cinza** | A cor existe na Yampi e no site, mas sem foto. |
| **Frete grátis acima de R$ 149,90** | Conferir com um CEP real no checkout. |

## Camisas

| O que falta | Por quê |
|---|---|
| **Tabela de medidas** (largura × comprimento por tamanho) | Evita troca por tamanho errado; é pendência essencial das camisas |
| **Tecido** das duas camisas | A camisa Bolsonaro tem "algodão, unissex" só no título do anúncio de origem das fotos |
| **Origem das fotos da camisa Bolsonaro** | Vieram de um anúncio da Shopee: usar só se forem do seu fornecedor |

## Recomendadas

| Chave | O que falta |
|---|---|
| `ESTOQUE` | Unidades por cor (limita a quantidade e marca “Esgotado”) |
| `FOTOS_REAIS` | Fotos reais: lateral, parte traseira e detalhe do acabamento |
| `CONDICOES_DE_FRETE` | Prazo de postagem após o pagamento |
| `POLITICAS` | Como acompanhar o pedido (rastreio) |
| `CONTATO` | Horário de atendimento |
| `URL_DO_SITE` | Endereço final (canonical, `og:url` e dados estruturados) |
| — | Cuidados/lavagem de cada modelo (`specs.care`) e circunferência em cm, se houver |
| — | Avaliações verificadas: o vendedor vai enviar. Só entram depoimentos reais, de preferência com origem (print/link) |

## Validações externas (fora do código)

- **Frete grátis na Yampi:** configurar frete grátis para pedidos acima de R$ 149,90. A página só anuncia; quem aplica é o checkout.
- **Preço progressivo na Yampi:** configurar o desconto de 2 ou mais unidades igual ao da página. Se a Yampi cobrar diferente, vale o valor da Yampi.
- **Yampi:** confirmar no painel que cada variação tem Link de compra próprio. Se só o produto tiver link, verificar como o checkout trata a escolha da variação e fazer uma compra de teste antes de publicar.
- **Cores:** as cores vieram do manual *PT Digital* (2021) e do *Manual da Marca PL 2023*. Confirmar se existem versões mais recentes.
  O tom `--pl-blue-deep` é derivado e não aparece no manual.
- **Revisão jurídica, recomendada antes de vender:** uso comercial dos nomes “Lula” e “Bolsonaro” e dos números 13 e 22,
  referência às cores partidárias e regras da legislação eleitoral para venda de produtos com identificação política,
  principalmente em período eleitoral.
- **Imagem de compartilhamento:** `public/og-13x22.png` foi gerada a partir de `og-13x22.svg` e pode ser substituída por uma arte com fotos reais.
- **Desempenho:** medir com Lighthouse ou PageSpeed depois do deploy, já com as fotos reais otimizadas (WebP/AVIF com `srcSet`).
  Nenhuma nota foi medida até agora.
