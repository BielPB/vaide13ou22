# Cadastro dos produtos na Yampi

Material pronto para cadastrar os **9 modelos (26 cores/SKUs)** na Yampi: 5 do lado 13 e 4 do lado 22. Os textos usam só o que você confirmou (fichas e fotos) e
estão alinhados com o site. **Os nomes precisam ficar iguais aos do site**, porque o cliente vê o nome no checkout.

## Antes de começar: o que ainda falta você preencher

| Campo na Yampi | Por que importa | Status |
|---|---|---|
| **Peso** (kg) de cada boné embalado | A Yampi calcula o frete com ele | ❗ Pesar um boné já embalado |
| **Dimensões da embalagem** (altura × largura × comprimento, em cm) | Idem | ❗ Medir a embalagem |
| **Estoque** de cada cor | Evita vender o que não tem | ❗ Contar |
| Material do Brasil e bandeira, do Flávio e do Simples | Ficha do produto | ❗ Pendente |
| Ficha do Simples (fechamento, tamanho) | Ficha do produto | ❗ Pendente |
| Ficha dos modelos do 13 (tecido, regulagem, tamanho) | Ficha do produto | ❗ Pendente |

**Arquivos prontos:**
- `yampi/skus.csv`: as colunas obrigatórias da planilha (slug, sku, nome, preco_venda, variacoes), com uma linha por cor. Preço em branco = falta informar.
- `yampi/fotos/`: fotos em JPG com o nome do SKU (ex.: `13-NUM-PRETO.jpg`). As que começam com o nome do modelo (ex.: `numero-13-geral-em-uso.jpg`) são fotos gerais do produto.

**Planilha:** baixe o modelo oficial em Produtos → Importar planilha → Baixar modelo e cole estas colunas nas de mesmo nome.
Não renomeie colunas e mantenha juntas as linhas de um mesmo produto. As fotos na planilha precisam ser links públicos;
como o site ainda não está no ar, envie as fotos direto em cada produto depois de importar.

**Preço riscado ("preço de" / "preço comparativo"): deixe em branco.** Só use se o boné já foi vendido por esse
valor de verdade.

**Preço de 2 ou mais:** não vai no cadastro do produto. Configure na Yampi como **desconto progressivo por
quantidade** (mesmo SKU/cor), com os valores da tabela de cada produto abaixo.

**Frete grátis acima de R$ 149,90 para todo o Brasil:** configure em Frete → Frete grátis.

---

# Lado 13

## 13.1 Boné Lula (estrela)

- **Nome:** `Boné Lula (estrela)` · **Slug:** `bone-nome-lula-estrela`
- **Preço de venda:** `45.90`
- **2 ou mais da mesma cor:** R$ 39,90 cada (desconto progressivo)
- **Variação:** Cor → Vermelho, Preto, Branco, Branco e preto

**Descrição:**

> Boné estilo trucker, com tela atrás e **LULA** com estrela na frente.
>
> **Cores:** vermelho, preto, branco e branco com preto.

| SKU | Cor | Foto (`yampi/fotos/`) |
|---|---|---|
| `13-LULAE-VERMELHO` | Vermelho | `13-LULAE-VERMELHO.jpg` |
| `13-LULAE-PRETO` | Preto | `13-LULAE-PRETO.jpg` |
| `13-LULAE-BRANCO` | Branco | `13-LULAE-BRANCO.jpg` |
| `13-LULAE-BRANCOPRETO` | Branco e preto | `13-LULAE-BRANCOPRETO.jpg` |

Gerais: `lula-estrela-geral-em-uso.jpg`, `lula-estrela-geral-detalhes.jpg` (a arte do fornecedor com a lista de características).
Só use essa arte se os itens dela forem verdadeiros para o boné que você vende.

## 13.2 Boné Número 13

- **Nome:** `Boné Número 13` · **Slug:** `bone-numero-13`
- **Preço de venda:** `45.90`
- **2 ou mais da mesma cor:** R$ 39,90 cada (desconto progressivo)
- **Variação:** Cor → Vermelho, Preto

**Descrição:**

> Boné estilo trucker, com tela atrás e o **número 13** grande na frente.
>
> **Cores:** vermelho (número branco) e preto (número vermelho).

| SKU | Cor | Foto |
|---|---|---|
| `13-NUM-VERMELHO` | Vermelho | `13-NUM-VERMELHO.jpg` |
| `13-NUM-PRETO` | Preto | `13-NUM-PRETO.jpg` |

Gerais: `numero-13-geral-vermelho-angulos.jpg`, `numero-13-geral-preto-angulos.jpg`, `numero-13-geral-em-uso.jpg`.

## 13.3 Boné Lula (letras grandes)

- **Nome:** `Boné Lula (letras grandes)` · **Slug:** `bone-nome-lula-letras`
- **Preço de venda:** `45.90`
- **2 ou mais da mesma cor:** R$ 39,90 cada (desconto progressivo)
- **Variação:** Cor → Vermelho, Branco, Branco e vermelho, Preto

**Descrição:**

> Boné estilo trucker, com tela atrás e **LULA** em letras grandes na frente.
>
> **Cores:** vermelho, branco, branco com vermelho e preto.

| SKU | Cor | Foto |
|---|---|---|
| `13-LULAL-VERMELHO` | Vermelho | `13-LULAL-VERMELHO.jpg` |
| `13-LULAL-BRANCO` | Branco | `13-LULAL-BRANCO.jpg` |
| `13-LULAL-BRANCOVERMELHO` | Branco e vermelho | `13-LULAL-BRANCOVERMELHO.jpg` |
| `13-LULAL-PRETO` | Preto | `13-LULAL-PRETO.jpg` |

Gerais: `lula-letras-geral-em-uso.jpg`, `lula-letras-geral-angulos.jpg`.

## 13.4 Boné Simples vermelho

- **Nome:** `Boné Simples vermelho` · **Slug:** `bone-simples-vermelho`
- **Preço de venda:** `39.90`
- **2 ou mais da mesma cor:** R$ 37,90 cada (desconto progressivo)
- **Variação:** Cor → Vermelho

> Boné liso, sem aplicação na frente, com aba curva. Cor: vermelho.

| SKU | Cor | Foto |
|---|---|---|
| `13-SIMP-VERMELHO` | Vermelho | `13-SIMP-VERMELHO.jpg` |

## 13.5 Boné Trucker liso

- **Nome:** `Boné Trucker liso` · **Slug:** `bone-trucker-liso`
- **Preço de venda:** `39.90`
- **2 ou mais da mesma cor:** R$ 37,90 cada (desconto progressivo)
- **Variação:** Cor → Preto

> Boné estilo trucker, com tela atrás, sem estampa. Cor: preto.

| SKU | Cor | Foto |
|---|---|---|
| `13-TRUCK-PRETO` | Preto | `13-TRUCK-PRETO.jpg` |

---

# Lado 22

## 1. Boné Brasil e bandeira

- **Nome:** `Boné Brasil e bandeira`
- **Slug (URL):** `bone-nome-e-bandeira`
- **Preço de venda:** `47.90`
- **2 ou mais da mesma cor:** R$ 39,90 cada (desconto progressivo)
- **Variação:** Cor → Azul, Preto, Verde, Amarelo, Branco

**Descrição** (colar no campo de descrição):

> Boné com a palavra **BRASIL** e a bandeira do Brasil na frente, com aba curva e regulagem atrás.
>
> - Regulagem tipo fitão (strapback): tamanho único, ajusta a diferentes tamanhos de cabeça
> - Aba curva
> - Costura reforçada
> - Leve e ventilado, para usar o dia todo
> - Boa fixação de cor com o uso frequente
>
> **Cores:** azul, preto, verde, amarelo e branco.

| SKU | Cor | Foto (em `public/produtos/`; em JPG: `yampi/fotos/<SKU>.jpg`) |
|---|---|---|
| `22-BAND-AZUL` | Azul | `22-bandeira/1.webp` |
| `22-BAND-PRETO` | Preto | `22-bandeira/2.webp` |
| `22-BAND-VERDE` | Verde | `22-bandeira/3.webp` |
| `22-BAND-AMARELO` | Amarelo | `22-bandeira/4.webp` |
| `22-BAND-BRANCO` | Branco | `22-bandeira/5.webp` |

---

## 2. Boné Simples

- **Nome:** `Boné Simples`
- **Slug:** `bone-simples`
- **Preço de venda:** `35.90`
- **2 ou mais da mesma cor:** R$ 29,90 cada
- **Variação:** Cor → Azul, Verde

**Descrição:**

> Boné liso, sem aplicação na frente, com aba curva.
>
> **Cores:** azul e verde.

*(Complete com material, fechamento e tamanho quando tiver a ficha.)*

| SKU | Cor | Foto |
|---|---|---|
| `22-SIMP-AZUL` | Azul | `22-simples/azul.webp` |
| `22-SIMP-VERDE` | Verde | `22-simples/verde.webp` |

---

## 3. Boné Camuflado

- **Nome:** `Boné Camuflado`
- **Slug:** `bone-camuflado`
- **Preço de venda:** `59.90`
- **2 ou mais da mesma cor:** R$ 49,90 cada
- **Variação:** Cor → Preto, Verde-oliva, Camuflado

**Descrição:**

> Boné estilo militar com patch da bandeira do Brasil na frente.
>
> - Tecido: poliéster
> - Fechamento com fivela e ilhós atrás: tamanho único, regulável. Unissex
> - Aba curva com visor rígido, que mantém o formato
> - Forro interno macio e faixa que absorve o suor
>
> **Cores:** preto, verde-oliva, cinza e camuflado.

| SKU | Cor | Foto |
|---|---|---|
| `22-CAMU-PRETO` | Preto | `22-camuflado/2.webp` |
| `22-CAMU-OLIVA` | Verde-oliva | `22-camuflado/3.webp` |
| `22-CAMU-CAMUFLADO` | Camuflado | `22-camuflado/6.webp` |

Fotos gerais do produto: `22-camuflado/1.webp` (as três cores), `5.webp` (detalhe do patch), `4.webp` (em uso).

---

## 4. Boné Flávio Bolsonaro

- **Nome:** `Boné Flávio Bolsonaro`
- **Slug:** `bone-flavio-bolsonaro`
- **Preço de venda:** `37.90`
- **2 ou mais da mesma cor:** R$ 32,90 cada
- **Variação:** Cor → Preto, Amarelo, Azul, Verde

**Descrição:**

> Boné estilo trucker, com tela atrás e “Flávio Bolsonaro” na frente. Aba curva e regulagem atrás.
>
> - Regulagem tipo fitão (strapback): tamanho único, ajusta a diferentes tamanhos de cabeça
> - Aba curva
> - Costura reforçada
> - Leve e ventilado, para usar o dia todo
> - Boa fixação de cor com o uso frequente
>
> **Cores:** preto, amarelo, azul e verde.

| SKU | Cor | Foto |
|---|---|---|
| `22-FLAV-PRETO` | Preto | `22-flavio/1.webp` |
| `22-FLAV-AMARELO` | Amarelo | `22-flavio/2.webp` |
| `22-FLAV-AZUL` | Azul | `22-flavio/3.webp` |
| `22-FLAV-VERDE` | Verde | `22-flavio/4.webp` |

---

## Depois de cadastrar

1. Em cada produto, copie o **🔗 Link de compra** de cada cor (Resumo / Variações).
2. Me mande os 26 links (nome – cor: link). Eu ligo cada um no site.
3. Faça uma compra de teste: 2 unidades da mesma cor (tem que cair para o preço de 2+) e um pedido acima de R$ 149,90 (frete grátis).
