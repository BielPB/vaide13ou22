/**
 * Parâmetros de campanha (UTMs) dos anúncios, repassados ao checkout.
 *
 * O cliente chega do anúncio com ?utm_source=...; o site guarda essas UTMs no
 * navegador (por até 7 dias, a mais recente vale) e as acrescenta ao link do
 * checkout. A Yampi mantém as UTMs até a compra e as envia no webhook, e é assim
 * que a UTMify sabe qual anúncio trouxe cada venda. Só as 5 UTMs padrão; nada de
 * produto, lado ou dado do cliente.
 */
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
export type Utms = Partial<Record<(typeof UTM_KEYS)[number], string>>

const KEY = 'asadelta:utm'
const TTL_MS = 7 * 24 * 60 * 60 * 1000
const MAX_LEN = 200

/** UTMs presentes num endereço (?utm_source=...). Valores vazios ou longos demais são ignorados. */
export function readUtms(search: string): Utms {
  const params = new URLSearchParams(search)
  const utms: Utms = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim()
    if (value && value.length <= MAX_LEN) utms[key] = value
  }
  return utms
}

/** Acrescenta as UTMs ao link do checkout, sem trocar as que o link já tiver. */
export function appendUtms(url: string, utms: Utms): string {
  const entries = Object.entries(utms).filter(([, v]) => v)
  if (entries.length === 0) return url
  const u = new URL(url)
  for (const [key, value] of entries) if (!u.searchParams.has(key)) u.searchParams.set(key, value!)
  return u.toString()
}

/** Guarda as UTMs do endereço atual, se houver (chamado ao abrir o site). */
export function rememberCampaign(search: string = typeof location === 'undefined' ? '' : location.search) {
  const utms = readUtms(search)
  if (Object.keys(utms).length === 0) return
  try {
    localStorage.setItem(KEY, JSON.stringify({ utms, savedAt: Date.now() }))
  } catch {
    // Sem armazenamento (aba anônima, bloqueio): as UTMs valem só enquanto o endereço as tiver.
  }
}

/** UTMs guardadas e ainda válidas. */
export function campaignUtms(now = Date.now()): Utms {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as { utms?: unknown; savedAt?: unknown } | null
    if (!saved || typeof saved.savedAt !== 'number' || now - saved.savedAt > TTL_MS) return {}
    // Relê pelo mesmo filtro: só as 5 UTMs, com valores de texto.
    const utms = saved.utms && typeof saved.utms === 'object' ? (saved.utms as Record<string, unknown>) : {}
    return readUtms(new URLSearchParams(Object.entries(utms).filter(([, v]) => typeof v === 'string') as [string, string][]).toString())
  } catch {
    return {}
  }
}

/** Link do checkout com as UTMs da campanha que trouxe o cliente. */
export const withCampaign = (url: string) => appendUtms(url, campaignUtms())
