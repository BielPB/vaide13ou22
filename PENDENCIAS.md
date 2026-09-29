# Pendências

**A loja está publicada (`status: 'live'`) e a compra está liberada.** Não há pendência essencial.
Os itens abaixo são recomendações para melhorar a página.

## Já recebido

- **Loja:** Asa Delta Store (asadeltastore.com) · **WhatsApp:** (21) 96952-6716
- **Oferta:** frete grátis para todo o Brasil em compras acima de R$ 149,90 (faixa no topo, compra, Entrega e FAQ).
- **Sem desconto por quantidade:** cada peça sai pelo preço de 1 unidade (o plano da Yampi não libera cupons nem faixas).
- **Lado 13:** Lula (estrela) e Lula (letras grandes) a R$ 45,90 (antes R$ 54,90) · Número 13 a R$ 39,90 (antes R$ 45,90) · Simples vermelho e Trucker liso a R$ 39,90 (antes R$ 49,90) · Camisa Lula 13 a R$ 49,90 (7 cores).
- **Lado 22:** Brasil e bandeira R$ 47,90 (antes R$ 59,90) · Simples R$ 35,90 (antes R$ 49,90) · Camuflado R$ 59,90 (antes R$ 79,90) · Flávio Bolsonaro R$ 37,90 (antes R$ 49,90) · Camisa Bolsonaro 22 a R$ 49,90 (branca e preta) · do Brasil com 22 R$ 49,90 (antes R$ 69,90; 4 cores) · Boné 22 R$ 49,90 (antes R$ 69,90; preto e branco, azul esgotado).
- **Preços anteriores (riscados):** praticados antes pelo vendedor, com a origem registrada em `compareAtSource`.
- **Camisas:** tamanhos P, M, G, GG (iguais aos da Yampi), algodão, cuidados de lavagem e tabela de medidas de **referência** (aviso de variação de até 2 cm).
- **Fotos:** confirmadas pelo vendedor como fiéis ao produto.
- **Fichas:** Brasil e bandeira e Flávio Bolsonaro com regulagem fitão/strapback e tamanho único. Camuflado em poliéster, com fivela e ilhós.
- **Checkout Yampi ligado:** 70 Links de compra, um por variação, conferidos abrindo cada link (34 cores de bonés + 36 cor×tamanho de camisas; o Azul do Boné 22 está esgotado); domínio próprio `seguro.asadeltastore.com` (CNAME na Vercel apontando para a Yampi; o endereço antigo `vai-de-13-ou-22.pay.yampi.com.br` também funciona).
- **Layout:** mesma estrutura da loja na Yampi (banner em `public/banner.webp` e `public/banner-celular.webp`, vitrines 13 e 22, rodapé com Informações).

## Resolvido para publicar

Pagamento (Pix e cartão em até 12x), postagem em até 2 dias úteis, frete, rastreio, políticas (privacidade, sobre a loja,
trocas, termos e cookies), declaração de loja independente, links de compra (63) e tabela de medidas de referência das camisas.

## Publicar o site

| O que | Como |
|---|---|
| **Hospedagem** | Vercel, importando o repositório do GitHub (feito) |
| **Domínio** | `asadeltastore.com`, registrado na Hostinger com os nameservers da Vercel. Falta adicionar `asadeltastore.com` e `www.asadeltastore.com` ao projeto na Vercel (Settings → Domains) |
| **Endereço final** | `store.siteUrl` = `https://asadeltastore.com` (liga canonical, `og:url`, imagem de compartilhamento e dados estruturados) |

## Recomendado (não bloqueia a venda)

| O que | Onde |
|---|---|
| Tecido, fechamento e tamanho dos bonés do lado 13 e do Simples (22); tecido do Brasil e bandeira e do Flávio | `models[].specs` em `store.ts` (sem o dado, a linha não aparece no site) |
| Confirmar as cores de cada modelo (lidas das fotos) | `products.*.models` |
| Medir uma camisa de cada tamanho para trocar a tabela de referência | `measurements` das camisas |
| Origem das fotos da camisa Bolsonaro (vieram de um anúncio da Shopee: usar só se forem do seu fornecedor) | `public/produtos/22-camisa` |
| Banner de celular com 1000 px ou mais de largura (o atual tem 500 px e fica pouco nítido em telas de alta resolução) | `public/banner-celular.webp` |
| Estoque por cor (limita a quantidade e marca “Esgotado”) | `variants[].stock` |
| Horário de atendimento | `contact.hours` |
| Cuidados/lavagem dos bonés e circunferência em cm, se houver | `specs.care` / `specs.measurements` |
| Avaliações: a Camisa Lula 13 tem 22 avaliações da loja na Shopee, sem estrelas. Faltam a nota (1 a 5) de cada uma, o link do anúncio na Shopee e avaliações dos outros produtos | `src/config/reviews.ts` |

## Aviso legal: identificação do vendedor

Por decisão do vendedor, o site **não mostra** nome completo nem CPF/CNPJ, só o endereço.
O Decreto 7.962/2013 (art. 2º) pede que sites de venda exibam nome ou razão social, CPF/CNPJ e endereço físico.
Isso fica registrado como aviso e não bloqueia a página. Para cumprir o decreto, preencha `store.legalName` e `store.documentId`.

## Na Yampi

| O que | Por quê |
|---|---|
| **Renomear os bonés "Nome"** | Deixar igual ao site: os dois "Boné Nome Lula" viram "Boné Lula (estrela)" e "Boné Lula (letras grandes)"; o "Nome e bandeira" vira "Boné Brasil e bandeira". Hoje, no checkout, os dois modelos do Lula aparecem com o mesmo nome. |
| **Trocar a marca "LULA13" por Asa Delta Store** | A marca aparece só em um dos lados e quebra o equilíbrio da loja. |
| **Barra do topo** | Trocar "Frete Grátis para todo Brasil!" por "Frete grátis para todo o Brasil acima de R$ 149,90" (sem o valor mínimo, a oferta é enganosa pelo CDC). |
| **Frase do rodapé** | Trocar "Encontre o boné perfeito para apoiar seu candidato." por "Bonés e camisas 13 e 22. Escolha o seu modelo." |
| **Seções de exemplo** | Ligar "Nome da coleção" às coleções Lula 13 / Bolsonaro 22 e desativar "Escolha por marcas". |
| **Pixels e análise** | O site usa o Meta Pixel (só PageView, `VITE_META_PIXEL_ID`) e o pixel da UTMify (`VITE_UTMIFY_PIXEL_ID`), com os IDs só na Vercel. Tirar o Meta Pixel da conta da UTMify para não duplicar o PageView. Na Yampi, conferir o que está ligado em Integrações/Marketing e não enviar eventos de produto ou compra com dado político. |
| **Preço promocional** | Só nos modelos com preço riscado no site (5 do lado 13; Brasil e bandeira, Camuflado e Flávio no 22). |
| **Frete grátis acima de R$ 149,90** | Conferir com um CEP real no checkout. A página só anuncia; quem aplica é a Yampi. |
| **Desconto de 2+ (desligado)** | Para reativar: plano com cupons → criar os cupons → testar no checkout → `quantityDiscountActive: true`. |

## Validações externas (fora do código)

- **Cores:** as cores vieram do manual *PT Digital* (2021) e do *Manual da Marca PL 2023*. Confirmar se existem versões mais recentes.
  O tom `--pl-blue-deep` é derivado e não aparece no manual.
- **Revisão jurídica, recomendada:** uso comercial dos nomes “Lula” e “Bolsonaro” e dos números 13 e 22,
  referência às cores partidárias e regras da legislação eleitoral para venda de produtos com identificação política,
  principalmente em período eleitoral.
- **Imagem de compartilhamento:** `public/og-13x22.png` foi gerada a partir de `og-13x22.svg` e pode ser substituída por uma arte com fotos reais.
- **Desempenho:** medir com Lighthouse ou PageSpeed depois do deploy. Banners, fotos das camisas e fotos das avaliações já estão em WebP (em 27/09/2026 caíram de ~3,3 MB para ~1 MB).
  Nenhuma nota foi medida até agora.
