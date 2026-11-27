/// <reference types="vite/client" />

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

interface ImportMetaEnv {
  /** Endpoint de Formspree (https://formspree.io/f/xxxx). Si no existe, el formulario usa WhatsApp. */
  readonly VITE_FORMSPREE_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
