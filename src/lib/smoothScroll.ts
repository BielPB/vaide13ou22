import { prefersReducedMotion } from './format'

/**
 * Rolagem suave da roda do mouse: cada giro desliza até parar (interpolação por
 * quadro), em vez de pular em degraus. Fica de fora:
 * - telas de toque (a rolagem nativa já tem inércia);
 * - quem pede menos movimento;
 * - Ctrl + roda (zoom), rolagem lateral e áreas que rolam sozinhas (listas, diálogos).
 * Teclado e barra de rolagem continuam nativos; qualquer um deles interrompe o deslize.
 */
export function enableSmoothWheel() {
  if (typeof window === 'undefined' || prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return

  const EASE = 0.12 // fração da distância percorrida por quadro
  let target = window.scrollY
  let current = window.scrollY
  let frame = 0

  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight
  const stop = () => {
    cancelAnimationFrame(frame)
    frame = 0
  }

  const step = () => {
    current += (target - current) * EASE
    if (Math.abs(target - current) < 0.5) current = target
    window.scrollTo({ top: current, behavior: 'instant' })
    frame = current === target ? 0 : requestAnimationFrame(step)
  }

  /** Algum elemento entre o alvo e a página ainda consegue rolar nessa direção? */
  const innerScrolls = (el: EventTarget | null, dy: number) => {
    for (let node = el instanceof Element ? el : null; node && node !== document.body; node = node.parentElement) {
      const { overflowY } = getComputedStyle(node)
      if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
        if (dy < 0 ? node.scrollTop > 0 : node.scrollTop + node.clientHeight < node.scrollHeight) return true
      }
    }
    return false
  }

  const onWheel = (e: WheelEvent) => {
    if (e.defaultPrevented || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
    if (document.querySelector('dialog[open]') || innerScrolls(e.target, e.deltaY)) return
    e.preventDefault()
    if (!frame) target = current = window.scrollY
    const dy = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY
    target = Math.max(0, Math.min(maxScroll(), target + dy))
    if (!frame) frame = requestAnimationFrame(step)
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', stop)
  window.addEventListener('pointerdown', stop)
}
