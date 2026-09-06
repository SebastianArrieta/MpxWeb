# UX — shell, entrada e inicio

Pieza de @UX sitio turismo.

## Archivos
- `css/shell.css` — tokens y layout compartido (alineado a `mapa.html`)
- `js/shell.js` — audiencia (`localStorage`), idioma, contador local, reorder del home, menú móvil
- `entrada.html` — gate visitante / momposino
- `index.html` — home con mismo contenido, distinto orden y CTAs

## Flujo
1. Sin preferencia → `entrada.html`
2. Elige audiencia → `index.html` reordena bloques
3. Chip en header cambia audiencia sin perder el resto

## Rutas maquetado (HTML estático)
`index` · `entrada` · `semana-santa` · `festival-jazz` · `que-ver` · `mapa` · `tours` · `autor` · `contacto`

Abrir con un servidor local en la raíz del repo o desde `maquetado/` para que `mapa.html` pueda hacer fetch de `content/places`.
