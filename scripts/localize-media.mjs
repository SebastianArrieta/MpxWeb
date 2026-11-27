#!/usr/bin/env node
/**
 * Descarga las imágenes que el sitio carga desde dominios externos
 * (Lovable y el bucket r2.dev) a public/media/images/ y reescribe las
 * referencias para que apunten a la copia local.
 *
 * Uso:
 *   npm run media:localize            # descarga y reescribe
 *   npm run media:localize -- --dry   # solo muestra qué haría
 *
 * Es idempotente: si ya no quedan URLs remotas, no hace nada.
 * Requiere Node 18+ (fetch nativo).
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DRY = process.argv.includes('--dry')
const OUT_DIR = path.join(ROOT, 'public', 'media', 'images')

const REMOTE_RE =
  /https:\/\/(?:mompox-magic-map\.lovable\.app|pub-[a-z0-9]+\.r2\.dev)\/[^\s"')]+/g

// Archivos donde se buscan URLs remotas.
const FILES = ['content/es/labels.json', 'content/en/labels.json', 'src/pages/Home.tsx', 'index.html']

/** hero-mompox-DYvqeVN5.jpg -> hero-mompox.jpg (quita el hash de Vite). */
function localName(url) {
  const { hostname, pathname } = new URL(url)
  const base = path.basename(pathname)
  if (hostname.endsWith('r2.dev')) return `og-mompox${path.extname(base) || '.png'}`
  if (base === 'favicon.ico') return 'favicon.ico'
  const ext = path.extname(base)
  return base.slice(0, -ext.length).replace(/-[A-Za-z0-9_]{8}$/, '') + ext
}

/** Ruta con la que se referencia el archivo local desde cada tipo de archivo. */
function localRef(file, name, url) {
  if (name === 'favicon.ico') return '/favicon.ico'
  if (file === 'index.html') {
    // og:image debe ser una URL absoluta del dominio final: se deja la remota
    // hasta configurar el dominio (ver README), pero igual se descarga la copia.
    if (new URL(url).hostname.endsWith('r2.dev')) return url
    return `/media/images/${name}`
  }
  return `media/images/${name}`
}

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
}

const urls = new Map() // url -> nombre local
const contents = new Map()
for (const file of FILES) {
  const text = await readFile(path.join(ROOT, file), 'utf8')
  contents.set(file, text)
  for (const url of text.match(REMOTE_RE) ?? []) urls.set(url, localName(url))
}

if (urls.size === 0) {
  console.log('No quedan imágenes remotas. Nada que hacer.')
  process.exit(0)
}

console.log(`${urls.size} imágenes remotas encontradas:`)
for (const [url, name] of urls) {
  const dest =
    name === 'favicon.ico' ? path.join(ROOT, 'public', 'favicon.ico') : path.join(OUT_DIR, name)
  console.log(`  ${url}\n    -> ${path.relative(ROOT, dest)}`)
  if (DRY) continue
  await mkdir(path.dirname(dest), { recursive: true })
  if (!(await exists(dest))) await download(url, dest)
}

let changed = 0
for (const [file, text] of contents) {
  let next = text
  for (const [url, name] of urls) next = next.split(url).join(localRef(file, name, url))
  if (next === text) continue
  changed++
  console.log(`${DRY ? '[dry] ' : ''}reescrito: ${file}`)
  if (!DRY) await writeFile(path.join(ROOT, file), next)
}

// Si el favicon pasó a local, el preconnect a Lovable ya no sirve.
if (!DRY) {
  const html = await readFile(path.join(ROOT, 'index.html'), 'utf8')
  const cleaned = html.replace(
    /\s*<link rel="preconnect" href="https:\/\/mompox-magic-map\.lovable\.app" \/>/,
    '',
  )
  if (cleaned !== html) await writeFile(path.join(ROOT, 'index.html'), cleaned)
}

if (DRY) console.log('\nDry run: no se descargó ni modificó nada.')
else if (changed === 0) console.log('\nTodo ya estaba local (solo queda og:image, a propósito).')
else console.log('\nListo. Revisa con `git diff` y comitea public/media/images/.')
