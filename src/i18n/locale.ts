import type { Lang } from '../context/AppContext'

/**
 * El idioma vive en la URL: español en la raíz (/mapa) e inglés bajo /en
 * (/en/mapa). Así cada versión tiene su propia dirección indexable.
 */
export const EN_PREFIX = '/en'

export function langFromPath(pathname: string): Lang {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`) ? 'en' : 'es'
}

/** '/en/mapa' -> '/mapa', '/en' -> '/'. Las rutas en español no cambian. */
export function stripLocale(pathname: string): string {
  if (langFromPath(pathname) === 'es') return pathname || '/'
  return pathname.slice(EN_PREFIX.length) || '/'
}

/** Convierte una ruta interna ('/mapa', '/mapa#x') a la del idioma dado. */
export function localizePath(path: string, lang: Lang): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  const base = stripLocale(path.replace(/[?#].*$/, ''))
  const rest = path.slice(path.replace(/[?#].*$/, '').length)
  if (lang === 'es') return base + rest
  return (base === '/' ? EN_PREFIX : `${EN_PREFIX}${base}`) + rest
}
