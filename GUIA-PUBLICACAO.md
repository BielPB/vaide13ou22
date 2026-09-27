# Guia para publicar a loja

Siga na ordem. Em cada passo está o que você faz e o que me manda.

---

## Passo 1 — Desconto de 2 ou mais: pausado

O plano atual da Yampi **não libera cupons nem faixas de desconto** ("acesso restrito").
Por isso a loja vende tudo pelo **preço de 1 unidade**, que é exatamente o que o checkout cobra.
- O site não mostra o preço de 2+ (`quantityDiscountActive: false`).
- As descrições da Yampi foram refeitas sem "Leve 2 ou mais" (`yampi/descricoes.html`). **Cole de novo nos produtos já cadastrados.**
- O site já está pronto para usar cupons pelo link (LULA2, LISO2, BRASIL2, SIMPLES2, CAMU2, FLAVIO2) se um dia o plano liberar.

---

## Passo 2 — Ajustes nos produtos (Yampi)

- [ ] Renomear na Yampi: os dois "Boné Nome Lula" para **Boné Lula (estrela)** e **Boné Lula (letras grandes)**, e o "Nome e bandeira" para **Boné Brasil e bandeira**.
- [ ] Trocar a **Marca** de "LULA13" para **vaide13ou22** em todos os produtos.
- [ ] Preencher **peso** (kg) e **medidas da embalagem** (cm) em todos: sem isso, o frete não é calculado.
- [ ] Me mandar uma **foto do Camuflado Cinza**.

---

## Passo 3 — Frete (Yampi → Frete)

- [ ] Configurar a transportadora ou os Correios.
- [ ] Configurar **frete grátis acima de R$ 149,90 para todo o Brasil**.
- [ ] Testar com um CEP de outro estado: abrir um link, subir a quantidade até passar de R$ 149,90 e ver o frete zerar.

**Me mande:** em quantos **dias úteis você posta** depois que o pagamento é aprovado.

---

## Passo 4 — Formas de pagamento

**Na Yampi:** Configurações → Pagamentos. Confira o que está ativo.

**Me mande:** Pix? Cartão em até quantas vezes, com ou sem juros? Boleto?

---

## Passo 5 — Ficha dos bonés

**Me mande o que souber** (tecido, fechamento e tamanho):

| Modelo | Falta |
|---|---|
| Boné Lula (estrela) | tecido, fechamento, tamanho |
| Boné Número 13 | tecido, fechamento, tamanho |
| Boné Lula (letras grandes) | tecido, fechamento, tamanho |
| Boné Simples vermelho | tecido, fechamento, tamanho |
| Boné Trucker liso | tecido, fechamento, tamanho |
| Boné Brasil 22 (Brasil e bandeira) | tecido |
| Boné Simples (22) | tecido, fechamento, tamanho |
| Boné Flávio Bolsonaro | tecido |
| Boné Camuflado | ✅ completo |

Se os bonés de mesmo tipo forem iguais (ex.: todos os trucker), é só dizer "os trucker são de ___ com fecho ___".

---

## Passo 6 — Políticas (eu escrevo, você revisa)

Eu redijo **Trocas e devoluções**, **Privacidade** e **Termos de venda** com base no Código de Defesa do Consumidor e na LGPD.

**Me responda:**
1. Além dos 7 dias de arrependimento (obrigatório por lei), você aceita troca de cor ou modelo? Em até quantos dias?
2. Na devolução por arrependimento ou defeito, o frete é por sua conta (é o que a lei exige). Para troca por gosto (outra cor), quem paga o frete?
3. Para onde o cliente devolve o produto? (o endereço é passado só no atendimento)
4. Como o cliente recebe o rastreio: e-mail automático da Yampi ou você manda no WhatsApp?
5. Horário de atendimento no WhatsApp.

---

## Passo 7 — Declaração da loja

**Me confirme** que esta frase é verdadeira, para ela aparecer no rodapé:

> Loja independente. Não temos vínculo com partidos, campanhas, candidatos ou com as pessoas citadas, e as vendas não são doações. Os nomes e números identificam os modelos dos produtos.

---

## Passo 8 — Domínio e hospedagem

1. **Domínio:** registre no [Registro.br](https://registro.br) (ex.: `vaide13ou22.com.br`, cerca de R$ 40/ano). **Me mande** o domínio escolhido.
2. **Hospedagem grátis:** crie uma conta na [Vercel](https://vercel.com) (pode entrar com Google ou GitHub).
3. Eu preparo o projeto para publicar e te guio na hora de conectar o domínio.

---

## Passo 9 — Compra de teste (você faz)

Com tudo no ar:
- [ ] 1 boné no Pix → conferir o pedido na Yampi.
- [ ] 2 bonés da mesma cor → conferir o desconto.
- [ ] Pedido acima de R$ 149,90 → conferir o frete grátis.
- [ ] Cancelar ou estornar os pedidos de teste na Yampi.
