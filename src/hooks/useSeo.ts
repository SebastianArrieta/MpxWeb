import { useEffect } from 'react'
import seo from '../../content/seo.json'
import type { Lang } from '../context/AppContext'

type SeoRoute = (typeof seo.routes)[number] & { aliases?: string[]; image?: string }

/** URL pública del sitio (sin "/" final), p. ej. https://mompoxmagico.com. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '')

const NOT_FOUND = {
  es: { title: 'Página no encontrada', description: 'Esta página no existe. Vuelve al inicio para seguir explorando Mompox.' },
  en: { title: 'Page not found', description: "This page doesn't exist. Go back home to keep exploring Mompox." },
}

export function findSeoRoute(pathname: string): SeoRoute | undefined {
  const path = pathname.replace(/\/+$/, '') || '/'
  return (seo.routes as SeoRoute[]).find(
    (route) => route.path === path || route.aliases?.includes(path),
  )
}

function absolute(path: string) {
  if (/^https?:/i.test(path)) return path
  const base = SITE_URL || window.location.origin
  return `${base}/${path.replace(/^\/+/, '')}`
}

function setMeta(attr: 'name' | 'property', key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (content === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!href) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Mantiene el <head> (título, descripción, Open Graph, canonical) al día con
 * la ruta y el idioma. El HTML inicial de cada ruta lo genera
 * scripts/seo-build.mjs con los mismos datos de content/seo.json.
 */
export function useSeo(pathname: string, lang: Lang) {
  useEffect(() => {
    const route = findSeoRoute(pathname)
    const copy = route ? route[lang] : NOT_FOUND[lang]
    const title =
      route?.path === '/'
        ? copy.title
        : seo.site.titleTemplate[lang].replace('{title}', copy.title)
    const image = absolute(route?.image ?? seo.site.defaultImage)
    const canonical = route && SITE_URL ? `${SITE_URL}${route.path === '/' ? '/' : route.path}` : null

    document.title = title
    setMeta('name', 'description', copy.description)
    setMeta('name', 'robots', route ? null : 'noindex')
    setMeta('property', 'og:title', copy.title)
    setMeta('property', 'og:description', copy.description)
    setMeta('property', 'og:locale', seo.site.locale[lang])
    setMeta('property', 'og:image', image)
    setMeta('property', 'og:url', canonical)
    setMeta('name', 'twitter:title', copy.title)
    setMeta('name', 'twitter:description', copy.description)
    setMeta('name', 'twitter:image', image)
    setCanonical(canonical)
  }, [pathname, lang])
}
