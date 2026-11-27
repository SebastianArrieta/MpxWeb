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
  /** URL pública del sitio sin "/" final (canonical, og:url, og:image, sitemap). */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
