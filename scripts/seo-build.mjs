#!/usr/bin/env node
/**
 * Paso posterior a `vite build`. A partir de content/seo.json:
 *   - Reescribe el bloque <!-- seo:start --> … <!-- seo:end --> de dist/index.html
 *     y crea dist/<ruta>/index.html para cada ruta, con su título, descripción,
 *     Open Graph, Twitter Card y canonical. Así WhatsApp, Facebook o Google
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
const LANG = 'es' // idioma por defecto del HTML inicial

const seo = JSON.parse(await readFile(path.join(ROOT, 'content/seo.json'), 'utf8'))
const labels = JSON.parse(await readFile(path.join(ROOT, 'content/es/labels.json'), 'utf8'))
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
const pageUrl = (routePath) => `${SITE_URL}${routePath === '/' ? '/' : routePath}`

function jsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: seo.site.name,
        inLanguage: ['es', 'en'],
        ...(SITE_URL ? { url: `${SITE_URL}/` } : {}),
      },
      {
        '@type': 'TouristDestination',
        name: labels.site.fullName,
        alternateName: 'Mompox',
        description: seo.routes[0].es.description,
        touristType: ['Turismo cultural', 'Turismo religioso', 'Turismo histórico'],
        geo: { '@type': 'GeoCoordinates', latitude: seo.site.geo.lat, longitude: seo.site.geo.lng },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Santa Cruz de Mompox',
          addressRegion: 'Bolívar',
          addressCountry: 'CO',
        },
        ...(SITE_URL ? { image: abs(seo.site.defaultImage), url: `${SITE_URL}/` } : {}),
      },
    ],
  }
  // "<" escapado para que el JSON nunca pueda cerrar la etiqueta <script>.
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

function headFor(route) {
  const copy = route[LANG]
  const title =
    route.path === '/' ? copy.title : seo.site.titleTemplate[LANG].replace('{title}', copy.title)
  const image = route.image ?? seo.site.defaultImage
  const tags = [
    '<!-- seo:start — generado desde content/seo.json por scripts/seo-build.mjs -->',
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(copy.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(seo.site.name)}" />`,
    `<meta property="og:locale" content="${seo.site.locale[LANG]}" />`,
    `<meta property="og:title" content="${esc(copy.title)}" />`,
    `<meta property="og:description" content="${esc(copy.description)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(copy.title)}" />`,
    `<meta name="twitter:description" content="${esc(copy.description)}" />`,
  ]
  if (SITE_URL) {
    tags.push(
      `<link rel="canonical" href="${esc(pageUrl(route.path))}" />`,
      `<meta property="og:url" content="${esc(pageUrl(route.path))}" />`,
      `<meta property="og:image" content="${esc(abs(image))}" />`,
      `<meta name="twitter:image" content="${esc(abs(image))}" />`,
    )
  }
  if (route.path === '/') {
    tags.push(`<link rel="preload" as="image" href="/media/images/hero-mompox.jpg" />`, jsonLd())
  }
  tags.push('<!-- seo:end -->')
  return tags.join('\n    ')
}

const written = []
for (const route of seo.routes) {
  const html = template.replace(BLOCK_RE, () => headFor(route))
  for (const p of [route.path, ...(route.aliases ?? [])]) {
    const file = p === '/' ? path.join(DIST, 'index.html') : path.join(DIST, p, 'index.html')
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, html)
    written.push(p)
  }
}

const robots = ['User-agent: *', 'Allow: /']
if (SITE_URL) robots.push('', `Sitemap: ${SITE_URL}/sitemap.xml`)
await writeFile(path.join(DIST, 'robots.txt'), robots.join('\n') + '\n')

if (SITE_URL) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = seo.routes
    .map(
      (r) =>
        `  <url><loc>${esc(pageUrl(r.path))}</loc><lastmod>${today}</lastmod><priority>${Number(r.priority ?? 0.5).toFixed(1)}</priority></url>`,
    )
    .join('\n')
  await writeFile(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )
}

console.log(`seo-build: ${written.length} páginas (${written.join(' ')})`)
if (!SITE_URL) {
  console.warn(
    'seo-build: falta VITE_SITE_URL → sin canonical, og:image ni sitemap.xml. Defínela al publicar (ver README).',
  )
}
