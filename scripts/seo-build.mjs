#!/usr/bin/env node
/**
 * Paso posterior a `vite build`. A partir de content/seo.json:
 *   - Reescribe el bloque <!-- seo:start --> … <!-- seo:end --> de dist/index.html
 *     y crea dist/<ruta>/index.html para cada ruta, con su título, descripción,
 *     Open Graph, Twitter Card, canonical y hreflang, en español (/ruta) y en
 *     inglés (/en/ruta). Así WhatsApp, Facebook o Google
 *     ven los datos correctos de cada página sin ejecutar JavaScript.
 *   - Escribe dist/robots.txt y, si hay VITE_SITE_URL, dist/sitemap.xml.
 *
 * Variables (en el entorno o en .env / .env.production):
 *   VITE_SITE_URL  URL pública sin "/" final, p. ej. https://mompoxmagico.com
 *                  Sin ella no se generan canonical, og:url, og:image ni sitemap
 *                  (todas necesitan URLs absolutas).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const env = { ...loadEnv('production', ROOT, 'VITE_'), ...process.env }
const SITE_URL = (env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '')
// Base de publicación (VITE_BASE), p. ej. '/MpxWeb/' en GitHub Pages.
const BASE = `/${(env.VITE_BASE ?? '/').replace(/^\/+|\/+$/g, '')}/`.replace(/\/+/g, '/')
const LANGS = ['es', 'en']
const EN_PREFIX = '/en'

const seo = JSON.parse(await readFile(path.join(ROOT, 'content/seo.json'), 'utf8'))
const labels = JSON.parse(await readFile(path.join(ROOT, 'content/es/labels.json'), 'utf8'))
const labelsEn = JSON.parse(await readFile(path.join(ROOT, 'content/en/labels.json'), 'utf8'))
const template = await readFile(path.join(DIST, 'index.html'), 'utf8')

const BLOCK_RE = /<!-- seo:start[\s\S]*?<!-- seo:end -->/
if (!BLOCK_RE.test(template)) {
  console.error('seo-build: no se encontró el bloque <!-- seo:start --> en dist/index.html')
  process.exit(1)
}

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const abs = (p) => `${SITE_URL}/${p.replace(/^\/+/, '')}`
/** '/mapa' -> '/mapa' (es) o '/en/mapa' (en); '/' -> '/' o '/en'. */
const localPath = (routePath, lang) =>
  lang === 'es' ? routePath : routePath === '/' ? EN_PREFIX : `${EN_PREFIX}${routePath}`
const pageUrl = (routePath, lang = 'es') => `${SITE_URL}${localPath(routePath, lang)}`

function jsonLd(lang) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: seo.site.name,
        inLanguage: lang,
        ...(SITE_URL ? { url: pageUrl('/', lang) } : {}),
      },
      {
        '@type': 'TouristDestination',
        name: (lang === 'en' ? labelsEn : labels).site.fullName,
        alternateName: 'Mompox',
        description: seo.routes[0][lang].description,
        touristType:
          lang === 'en'
            ? ['Cultural tourism', 'Religious tourism', 'Heritage tourism']
            : ['Turismo cultural', 'Turismo religioso', 'Turismo histórico'],
        geo: { '@type': 'GeoCoordinates', latitude: seo.site.geo.lat, longitude: seo.site.geo.lng },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Santa Cruz de Mompox',
          addressRegion: 'Bolívar',
          addressCountry: 'CO',
        },
        ...(SITE_URL ? { image: abs(seo.site.defaultImage), url: pageUrl('/', lang) } : {}),
      },
    ],
  }
  // "<" escapado para que el JSON nunca pueda cerrar la etiqueta <script>.
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

function headFor(route, lang) {
  const copy = route[lang]
  const title =
    route.path === '/' ? copy.title : seo.site.titleTemplate[lang].replace('{title}', copy.title)
  const image = route.image ?? seo.site.defaultImage
  const tags = [
    '<!-- seo:start — generado desde content/seo.json por scripts/seo-build.mjs -->',
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(copy.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(seo.site.name)}" />`,
    `<meta property="og:locale" content="${seo.site.locale[lang]}" />`,
    `<meta property="og:title" content="${esc(copy.title)}" />`,
    `<meta property="og:description" content="${esc(copy.description)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(copy.title)}" />`,
    `<meta name="twitter:description" content="${esc(copy.description)}" />`,
  ]
  if (SITE_URL) {
    tags.push(
      `<link rel="canonical" href="${esc(pageUrl(route.path, lang))}" />`,
      `<link rel="alternate" hreflang="es" href="${esc(pageUrl(route.path, 'es'))}" />`,
      `<link rel="alternate" hreflang="en" href="${esc(pageUrl(route.path, 'en'))}" />`,
      `<link rel="alternate" hreflang="x-default" href="${esc(pageUrl(route.path, 'es'))}" />`,
      `<meta property="og:locale:alternate" content="${seo.site.locale[lang === 'es' ? 'en' : 'es']}" />`,
      `<meta property="og:url" content="${esc(pageUrl(route.path, lang))}" />`,
      `<meta property="og:image" content="${esc(abs(image))}" />`,
      `<meta name="twitter:image" content="${esc(abs(image))}" />`,
    )
  }
  if (route.path === '/') {
    tags.push(`<link rel="preload" as="image" href="${BASE}media/images/hero-mompox.jpg" />`, jsonLd(lang))
  }
  tags.push('<!-- seo:end -->')
  return tags.join('\n    ')
}

const written = []
for (const lang of LANGS) {
  for (const route of seo.routes) {
    const html = template
      .replace(BLOCK_RE, () => headFor(route, lang))
      .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    for (const p of [route.path, ...(route.aliases ?? [])]) {
      const urlPath = localPath(p, lang)
      const file = path.join(DIST, urlPath, 'index.html')
      await mkdir(path.dirname(file), { recursive: true })
      await writeFile(file, html)
      written.push(urlPath)
    }
  }
}

// 404.html: GitHub Pages (y otros hostings estáticos) lo sirven para rutas
// desconocidas; es la app normal, que muestra su página 404 con noindex.
await writeFile(path.join(DIST, '404.html'), await readFile(path.join(DIST, 'index.html'), 'utf8'))

const robots = ['User-agent: *', 'Allow: /']
if (SITE_URL) robots.push('', `Sitemap: ${SITE_URL}/sitemap.xml`)
await writeFile(path.join(DIST, 'robots.txt'), robots.join('\n') + '\n')

if (SITE_URL) {
  const today = new Date().toISOString().slice(0, 10)
  const alternates = (r) =>
    ['es', 'en', 'x-default']
      .map(
        (h) =>
          `<xhtml:link rel="alternate" hreflang="${h}" href="${esc(pageUrl(r.path, h === 'en' ? 'en' : 'es'))}"/>`,
      )
      .join('')
  const urls = LANGS.flatMap((lang) =>
    seo.routes.map(
      (r) =>
        `  <url><loc>${esc(pageUrl(r.path, lang))}</loc><lastmod>${today}</lastmod><priority>${Number(r.priority ?? 0.5).toFixed(1)}</priority>${alternates(r)}</url>`,
    ),
  ).join('\n')
  await writeFile(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  )
}

console.log(`seo-build: ${written.length} páginas (${written.join(' ')})`)
if (!SITE_URL) {
  console.warn(
    'seo-build: falta VITE_SITE_URL → sin canonical, og:image ni sitemap.xml. Defínela al publicar (ver README).',
  )
}
