/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** ID do Meta Pixel. Fica na Vercel (Environment Variables), nunca no código: o repositório é público. */
  readonly VITE_META_PIXEL_ID?: string
  /** ID do pixel da UTMify. Também fica só na Vercel. */
  readonly VITE_UTMIFY_PIXEL_ID?: string
}
