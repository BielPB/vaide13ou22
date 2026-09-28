/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** ID do Meta Pixel. Fica na Vercel (Environment Variables), nunca no código: o repositório é público. */
  readonly VITE_META_PIXEL_ID?: string
}
