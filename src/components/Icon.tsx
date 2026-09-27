/** Ícones de traço simples (24×24), herdam a cor do texto. */
const paths = {
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z',
  truck: 'M3 6h11v9H3zM14 9h4l3 3v3h-7M7.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  refresh: 'M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5',
  chat: 'M4 5h16v11H9l-5 4z',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z M8.5 12l2.5 2.5 4.5-5',
  card: 'M3 6h18v12H3zM3 10h18M7 15h4',
  send: 'M21 3L3 10.5l7 2.5 2.5 7zM10 13l5-5',
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}

/** Marca de cada lado na barra de categorias: estrela vermelha (Lula 13) e bandeira do Brasil (Bolsonaro 22). */
export function SideMark({ side }: { side: '13' | '22' }) {
  if (side === '13') {
    return (
      <svg className="side-mark" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="#e4142c" />
      </svg>
    )
  }
  // Verde, amarelo e azul da bandeira (valores hexadecimais de uso comum).
  return (
    <svg className="side-mark side-mark--flag" viewBox="0 0 28 20" width="22" height="16" aria-hidden="true">
      <rect width="28" height="20" rx="2" fill="#009c3b" />
      <path d="M14 2.6L25.4 10 14 17.4 2.6 10z" fill="#ffdf00" />
      <circle cx="14" cy="10" r="4.4" fill="#002776" />
      <path d="M9.8 9.1c2.9-.5 5.9.1 8.3 1.6" stroke="#fff" strokeWidth="0.9" fill="none" />
    </svg>
  )
}
