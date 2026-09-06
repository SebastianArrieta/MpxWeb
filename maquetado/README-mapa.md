# Mapa (maquetado)

Pieza de @Mapa y lugares para `/mapa`.

## Archivos
- `content/places/schema.json` — campos de tabla Lovable Cloud
- `content/places/categories.json` — filtros (alineados a `content/es/labels.json`)
- `content/places/places.json` — selección inicial pública; coords OSM donde hubo match; foto/horario/tel y algunos coords `pendiente`
- `maquetado/mapa.html` — shell: buscador, filtros, lista ↔ marcadores, ficha + «Cómo llegar»

## Notas
- Sin teléfonos ni horarios inventados.
- Google Maps real se cablea después; este HTML es maquetado local.
- Abrir `maquetado/mapa.html` vía servidor local (o desde el scaffold) para que el `fetch` de `places.json` funcione.
