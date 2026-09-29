# Asa Delta Store

Loja de bonés e camisas **Lula 13** e **Bolsonaro 22**, em [asadeltastore.com](https://asadeltastore.com).
Feita com React, TypeScript e Vite, com CSS puro. Não há backend. A única medição é o Meta Pixel (só PageView), ligado pela variável `VITE_META_PIXEL_ID` na Vercel.

> **Status: PRÉVIA.** A compra fica bloqueada até que os dados de `PENDENCIAS.md` sejam preenchidos
> e `status` passe para `'live'` em `src/config/store.ts`. A prévia sai com `noindex`.

## Comandos

```bash
npm install
npm run dev          # http://localhost:5173  (adicione ?exemplo para ver o layout preenchido com dados fictícios)
npm run build        # checagem de tipos + build de produção em dist/
npm run preview      # serve o dist/
npm test             # testes da lógica de preço, quantidade, variante e checkout
```

`?exemplo` só funciona em `npm run dev`. O arquivo `src/config/example.ts` não entra no build.

## Layout e hierarquia de compra

1. **Faixa de oferta** (frete grátis) e cabeçalho com a linha vermelha e azul do 13|22.
2. **Abas 13 | 22:** a assinatura da loja e o jeito de trocar de lado.
3. **Faixa de modelos** do lado escolhido, com foto grande, preço e selo de desconto real.
4. **Produto (#comprar):** galeria + compra enxuta.
   - preço (com o anterior riscado, quando real) e formas de pagamento;
   - cores em amostras com foto e, nas camisas, tamanho (a página nunca escolhe o tamanho pelo cliente);
   - quantidade e **Comprar · R$ total** na mesma linha;
   - progresso do frete grátis e garantias reais.
5. **Faixa escura de garantias:** 7 dias, troca por defeito, frete grátis e WhatsApp.
6. **Sobre o produto:** descrição completa (a mesma da Yampi) e, ao lado, a ficha técnica; nas camisas, a tabela de medidas.
7. **Dúvidas** em duas colunas e **rodapé** com as políticas.

A página abre no produto definido em `defaultSelection`, em `store.ts`.

**Descrições:** a fonte única é `src/config/descricoes.json`. O site lê esse arquivo, e os scripts de `yampi/` também. Use `**negrito**` para os destaques.

**Não entram, de propósito:** pop-up de entrada, preço riscado sem preço anterior real, contagem de avaliações ou estoque inventada e cronômetro na página.

### Cores

As cores foram tiradas dos manuais oficiais, consultados em 26/09/2026:

| Token | Valor | Fonte |
|---|---|---|
| `--pt-red` | `#E4142C` | *Manual de Uso da Marca PT Digital* (2021), padrão cromático |
| `--pt-red-deep` | `#B9142C` | idem (segundo tom do gradiente vermelho) |
| `--pl-blue` | `#004F9F` | *Manual da Marca PL 2023*: R0 G79 B159 / C100 M70 Y0 K0 |
| `--pl-green` | `#009640` | idem: R0 G150 B64 |
| `--pl-yellow` | `#FFD500` | idem: R255 G213 B0 |
| `--pl-blue-deep` | `#003E7E` | **derivado**, não consta no manual (usado no “22” de fundo) |

O manual do PL traz só RGB e CMYK. O hexadecimal da tabela é a conversão direta desses valores.
O manual do PT localizado é a versão “PT Digital”, arquivada no acervo da Fundação Perseu Abramo.
Vale confirmar com a fonte se existe versão mais recente (item em `PENDENCIAS.md`).

## Como editar

Tudo fica em **`src/config/store.ts`**, e os tipos estão documentados em `src/config/types.ts`.
Um campo `null` significa “não confirmado”: a prévia mostra um selo **Pendente** e a loja publicada esconde o bloco.

### Estrutura dos produtos
Cada lado (13 e 22) tem **modelos**, e cada modelo tem **cores**. Cada cor é um SKU com seu próprio Link de compra na Yampi.

```ts
{
  id: 'camuflado',
  name: 'Camuflado',
  description: 'Patch da bandeira do Brasil na frente, em tons militares.', // só o que é visível ou confirmado
  priceCents: 5990,                                   // 1 unidade: R$ 59,90
  tiers: [{ minQuantity: 2, priceCents: 4990 }],      // 2 ou mais: R$ 49,90 cada
  images: [ /* fotos do modelo */ ],
  variants: [
    { id: 'preto', label: 'Preto', stock: null, available: true,
      image: '/produtos/22-camuflado/2.webp',          // foto que a galeria mostra ao escolher a cor
      checkoutUrl: 'https://seguro.suaLoja.com.br/r/TOKEN' },
  ],
  specs: { material: null, closure: null, measurements: null, care: null, highlights: [] },
}
```
- **Preço progressivo:** vale para a quantidade do mesmo modelo. Precisa estar configurado **igual** na Yampi, porque quem cobra é o checkout.
- `stock: null` significa que o estoque não é mostrado; `0` marca a cor como esgotada.
- Quando o modelo tem só uma cor, ela já vem selecionada. Com mais de uma, o visitante escolhe.
- O card de cada lado mostra "a partir de" com o menor preço de 1 unidade.

### Imagens
Coloque as fotos em `public/produtos/<pasta>/` e referencie com `photo('pasta/arquivo.webp', 'Legenda', 'Texto alternativo', largura, altura)`.
A `heroImage` de cada lado aparece no hero e no card de seleção e é pré-carregada.
Ilustrações provisórias usam `illustrative: true` e recebem o selo "Ilustração".

### Checkout (Yampi)
O checkout é da **Yampi**. A página envia o visitante ao Link de compra da variante escolhida, já com a quantidade.

1. No painel da Yampi: **Produtos → produto → Resumo → 🔗 Link de compra**. O link tem o formato `https://seguro.suaLoja.com.br/r/TOKEN`.
2. Em `store.ts`, preencha o domínio do checkout:
   ```ts
   checkout: { kind: 'yampi', checkoutHost: 'seguro.suaLoja.com.br', maxQuantity: 10 },
   ```
3. Cole o Link de compra em cada cor (`variants[].checkoutUrl`):
   ```ts
   { id: 'preto', label: 'Preto', priceCents: null, stock: 25, available: true,
     checkoutUrl: 'https://seguro.suaLoja.com.br/r/AABBJJ' }
   ```
4. A página gera `https://seguro.suaLoja.com.br/r/AABBJJ:2` (token:quantidade), no formato
   [documentado pela Yampi](https://help.yampi.com.br/pt-BR/articles/6067074-como-gerar-um-link-de-compra-para-varios-produtos).
   A Yampi calcula frete e total e confirma preço e estoque.

Regras:
- Links de outro domínio ou fora do formato `/r/TOKEN` são recusados com mensagem de erro, sem abrir nada.
- `maxQuantity` é o limite de unidades oferecido na página. O estoque (`stock`) também limita.
- O preço exibido na página precisa ser igual ao cadastrado na Yampi. Quem vale no pagamento é o preço da Yampi.
- Não usamos `metadata`, UTMs nem cupons no link. Cupom (`?promocode=`) só entra se houver uma promoção real.
- **Carrinho futuro:** a Yampi aceita vários itens no mesmo link (`/r/TOKEN1:1,TOKEN2:2`), e `buildCheckoutUrl` já monta esse formato
  (há teste cobrindo). Para oferecer "levar os dois", falta só a interface de carrinho.
- Outros provedores continuam possíveis com `kind: 'link'` (veja `src/config/types.ts`).

### Loja, contato, frete, pagamento e políticas
Preencha `store`, `contact`, `commerce` e `policies`. Na declaração de independência, `confirmed: true` só deve ser marcado depois de confirmar que ela é verdadeira.

### Avaliações
`reviews: []` mantém a seção oculta. Entram apenas avaliações verificadas (`verified: true`), de preferência com `sourceUrl`.

### Publicar
1. Resolva as pendências essenciais. A lista aparece no rodapé da prévia e em `PENDENCIAS.md`.
2. Preencha `siteUrl` (usado em canonical, `og:url` e nos dados estruturados).
3. Mude `status: 'live'`. Mesmo em `live`, a compra continua bloqueada enquanto faltar dado essencial.
4. Rode `npm test` e `npm run build`, e publique o `dist/` em uma hospedagem estática.

## Privacidade e medição

A escolha do modelo fica só na memória da aba: não é salva, enviada ou medida.
**Meta Pixel** (`src/lib/metaPixel.ts`): só carrega se a variável `VITE_META_PIXEL_ID` estiver configurada na Vercel
(o ID nunca vai para o código, porque o repositório é público). Envia apenas `PageView`, uma vez por página, com a coleta
automática da Meta desligada. Não envie eventos com produto, lado (13/22), carrinho ou compra, e não crie públicos de
afinidade política. As políticas de privacidade e de cookies descrevem esse uso; mude as duas se a medição mudar.

**UTMs de anúncio** (`src/lib/campaign.ts`): as 5 UTMs padrão da página de entrada ficam no navegador por até 7 dias e são
acrescentadas ao link do checkout. A Yampi as envia no webhook, e a UTMify atribui a venda ao anúncio (sem pixel da UTMify no site).

## Estrutura

```
src/
  config/        store.ts (dados reais), types.ts, example.ts (dev), index.ts
  lib/           purchase.ts (preço, faixas, checkout Yampi) · pending.ts · shop.tsx (estado) · format.ts
  components/    Header (faixa de oferta), ProductPage (galeria + compra), ProductGallery, Lightbox,
                 ModelSections (destaques, grade de modelos, ficha, garantia), Reviews, FAQ,
                 StickyPurchaseBar, BuyButton, ContactLinks, Footer, ProductImageView, Pending
  styles/        index.css (tokens e base) · pdp.css (página de produto)
public/produtos/ fotos dos modelos (22-bandeira, 22-simples, 22-camuflado, 22-flavio) e ilustração do 13
marca/           logos do checkout e prévia de cores
```

