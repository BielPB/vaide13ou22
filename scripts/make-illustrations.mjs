// Gera as ilustrações PROVISÓRIAS dos bonés em /public/produtos.
// São desenhos neutros (tons de pedra) apenas para ocupar o espaço das fotos;
// não representam cor, material ou acabamento do produto real.
// Uso: node scripts/make-illustrations.mjs
import { mkdirSync, writeFileSync } from 'node:fs'

const out = new URL('../public/produtos/', import.meta.url)
mkdirSync(out, { recursive: true })

const palette = {
  crownHi: '#F3F0E9',
  crown: '#E4DFD4',
  crownLo: '#C9C1B2',
  seam: '#B3AA99',
  brimTop: '#DAD4C8',
  brimEdge: '#A99F8D',
  under: '#8F8675',
  ink: '#2B2A2E',
}

const defs = (id) => `
  <defs>
    <radialGradient id="crown-${id}" cx="42%" cy="30%" r="80%">
      <stop offset="0" stop-color="${palette.crownHi}"/>
      <stop offset=".55" stop-color="${palette.crown}"/>
      <stop offset="1" stop-color="${palette.crownLo}"/>
    </radialGradient>
    <linearGradient id="brim-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${palette.brimTop}"/>
      <stop offset="1" stop-color="${palette.crownLo}"/>
    </linearGradient>
    <filter id="shadow-${id}" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>`

const numberText = (n, x, y, size, extra = '') =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="${size}" letter-spacing="-6" fill="${palette.ink}" ${extra}>${n}</text>`

// viewBox recortado (1200 × 800) para o boné ocupar o quadro sem sobras.
const VB = 'viewBox="0 180 1200 800" width="1200" height="800"'

function front(n) {
  const id = `f${n}`
  return `<svg xmlns="http://www.w3.org/2000/svg" ${VB}>${defs(id)}
  <ellipse cx="600" cy="905" rx="330" ry="34" fill="#000" opacity=".24" filter="url(#shadow-${id})"/>
  <path d="M292 728 C 292 440, 430 292, 600 292 C 770 292, 908 440, 908 728 Z" fill="url(#crown-${id})"/>
  <path d="M600 296 C 490 350, 410 520, 398 728" fill="none" stroke="${palette.seam}" stroke-width="4"/>
  <path d="M600 296 C 710 350, 790 520, 802 728" fill="none" stroke="${palette.seam}" stroke-width="4"/>
  <path d="M600 296 L 600 470" fill="none" stroke="${palette.seam}" stroke-width="3" opacity=".5"/>
  <ellipse cx="600" cy="296" rx="30" ry="12" fill="${palette.crown}" stroke="${palette.seam}" stroke-width="3"/>
  <circle cx="455" cy="430" r="6" fill="${palette.seam}"/><circle cx="745" cy="430" r="6" fill="${palette.seam}"/>
  ${numberText(n, 600, 648, 210)}
  <path d="M262 716 C 380 692, 820 692, 938 716 C 920 812, 780 872, 600 874 C 420 872, 280 812, 262 716 Z" fill="url(#brim-${id})"/>
  <path d="M262 716 C 380 692, 820 692, 938 716" fill="none" stroke="${palette.brimEdge}" stroke-width="5"/>
  <path d="M272 760 C 330 836, 460 874, 600 876 C 740 874, 870 836, 928 760" fill="none" stroke="${palette.under}" stroke-width="7" opacity=".55"/>
  <path d="M310 748 C 380 800, 480 828, 600 830 C 720 828, 820 800, 890 748" fill="none" stroke="${palette.seam}" stroke-width="3" stroke-dasharray="10 10" opacity=".75"/>
</svg>`
}

function threeQuarter(n) {
  const id = `l${n}`
  return `<svg xmlns="http://www.w3.org/2000/svg" ${VB}>${defs(id)}
  <ellipse cx="590" cy="905" rx="400" ry="38" fill="#000" opacity=".24" filter="url(#shadow-${id})"/>
  <path d="M360 736 C 340 460, 500 300, 700 300 C 890 300, 990 450, 990 736 Z" fill="url(#crown-${id})"/>
  <path d="M700 304 C 580 350, 500 520, 500 736" fill="none" stroke="${palette.seam}" stroke-width="4"/>
  <path d="M700 304 C 810 360, 870 520, 872 736" fill="none" stroke="${palette.seam}" stroke-width="4"/>
  <ellipse cx="700" cy="304" rx="30" ry="12" fill="${palette.crown}" stroke="${palette.seam}" stroke-width="3"/>
  <circle cx="585" cy="440" r="6" fill="${palette.seam}"/><circle cx="900" cy="480" r="6" fill="${palette.seam}"/>
  ${numberText(n, 610, 650, 200, 'transform="translate(610 650) skewY(-5) scale(.84 1) translate(-610 -650)"')}
  <path d="M372 724 C 280 732, 150 790, 150 842 C 158 900, 440 890, 610 830 C 690 800, 730 768, 712 740 C 580 720, 460 716, 372 724 Z" fill="url(#brim-${id})"/>
  <path d="M372 724 C 460 716, 580 720, 712 740" fill="none" stroke="${palette.brimEdge}" stroke-width="5"/>
  <path d="M150 842 C 158 900, 440 890, 610 830" fill="none" stroke="${palette.under}" stroke-width="7" opacity=".55"/>
  <path d="M196 826 C 260 856, 440 842, 588 796" fill="none" stroke="${palette.seam}" stroke-width="3" stroke-dasharray="10 10" opacity=".75"/>
  <path d="M712 738 L 990 736" stroke="${palette.crownLo}" stroke-width="6"/>
</svg>`
}

for (const n of ['13']) {
  writeFileSync(new URL(`bone-${n}-frente.svg`, out), front(n))
  writeFileSync(new URL(`bone-${n}-lateral.svg`, out), threeQuarter(n))
}

// Imagem de compartilhamento (convertida para PNG em scripts/README).
const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="600" height="630" fill="#E4142C"/>
  <rect x="600" width="600" height="630" fill="#004F9F"/>
  <path d="M1200 470 L 1200 630 L 960 630 Z" fill="#009640"/>
  <path d="M1200 540 L 1200 630 L 1080 630 Z" fill="#FFD500"/>
  <text x="300" y="470" text-anchor="middle" font-family="'Arial Black', Arial, sans-serif" font-weight="900" font-size="420" letter-spacing="-20" fill="#B9142C">13</text>
  <text x="900" y="470" text-anchor="middle" font-family="'Arial Black', Arial, sans-serif" font-weight="900" font-size="420" letter-spacing="-20" fill="#003E7E">22</text>
  <circle cx="600" cy="300" r="46" fill="#F6F4EF"/>
  <path d="M582 282 L 618 318 M618 282 L 582 318" stroke="#16161A" stroke-width="7" stroke-linecap="round"/>
  <text x="600" y="92" text-anchor="middle" font-family="'Arial Black', Arial, sans-serif" font-weight="900" font-size="58" fill="#FFFFFF">13 ou 22. Qual vai na sua cabeça?</text>
  <text x="600" y="574" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="30" fill="#FFFFFF">Bonés 13 e 22</text>
</svg>`
writeFileSync(new URL('../og-13x22.svg', out), og)
console.log('ok')
