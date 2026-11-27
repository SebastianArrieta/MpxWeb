#!/usr/bin/env node
/**
 * Lista qué le falta a cada lugar de content/places/places.json.
 * Uso: npm run places:report
 *
 * Los lugares con ubicacion_verificada=false NO aparecen en el mapa público:
 * para publicarlos hay que confirmar lat/lng (por ejemplo, con un pin de
 * Google Maps tomado en el sitio) y poner ubicacion_verificada en true.
 */
import { readFile } from 'node:fs/promises'

const data = JSON.parse(
  await readFile(new URL('../content/places/places.json', import.meta.url), 'utf8'),
)

const hidden = data.items.filter((p) => p.ubicacion_verificada !== true)
const visible = data.items.filter((p) => p.ubicacion_verificada === true)
const missing = (p) => [
  ...new Set([...(p.pendiente_campos ?? []), ...(p.foto ? [] : ['foto'])]),
]

console.log(`Lugares: ${data.items.length} · en el mapa: ${visible.length} · ocultos: ${hidden.length}\n`)

console.log('OCULTOS (falta verificar coordenadas):')
for (const p of hidden) console.log(`  - ${p.id.padEnd(24)} ${p.categoria.padEnd(14)} falta: ${missing(p).join(', ')}`)

console.log('\nVISIBLES con datos incompletos:')
for (const p of visible) {
  const m = missing(p)
  if (m.length) console.log(`  - ${p.id.padEnd(24)} ${p.categoria.padEnd(14)} falta: ${m.join(', ')}`)
}
