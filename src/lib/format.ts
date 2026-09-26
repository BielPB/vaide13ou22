const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatBRL = (cents: number) => brl.format(cents / 100)

export const whatsappUrl = (number: string) => `https://wa.me/${number.replace(/\D/g, '')}`

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle.replace(/^@/, '')}/`

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Rola até um elemento e move o foco para ele (sem pular de novo a tela). */
export function scrollToAndFocus(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}
