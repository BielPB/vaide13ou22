/**
 * Lê uma chave do localStorage e, se ela ainda não existir, traz o valor salvo
 * com o nome antigo (antes da troca do nome da loja) e apaga a chave velha.
 * Pode lançar erro se o navegador bloquear o armazenamento: quem chama trata.
 */
export function readMigrated(key: string, oldKey: string): string | null {
  const value = localStorage.getItem(key)
  if (value !== null) return value
  const old = localStorage.getItem(oldKey)
  if (old !== null) {
    localStorage.setItem(key, old)
    localStorage.removeItem(oldKey)
  }
  return old
}
