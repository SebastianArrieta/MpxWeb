# Mompox Mágico — guía turística de Santa Cruz de Mompox

Sitio turístico de **Santa Cruz de Mompox** construido con Vite, React, React Router y TypeScript. El contenido estático vive en `content/`; el mapa usa MapLibre GL con teselas de OpenStreetMap.

## Cómo correr en local

```bash
npm install
npm run dev
```

Abrir la URL que muestre Vite (por defecto http://localhost:5173).

Para compilar producción:

```bash
npm run build
npm run preview
```

## Rutas

- `/` – Inicio
- `/semana-santa` – Semana Santa
- `/festival-jazz` – Festival Jazz
- `/que-ver` – Que ver
- `/mapa` – Mapa interactivo OpenStreetMap
- `/tours` – Tours
- `/eventos` – Resumen de eventos
- `/itinerarios` – Itinerarios
- `/como-llegar` – Cómo llegar
- `/galeria` – Galería
- `/sobre-nosotros` – Sobre nosotros
- `/autor` – Alias de Sobre nosotros
- `/contacto` – Contacto

## Notas del maquetado

- Guía de diseño (colores, tipografía, componentes, contraste): [`SKILLS/DESIGN.MD`](SKILLS/DESIGN.MD).

- Barra superior: logo, navegación agrupada, toggle ES|EN y acceso al mapa. La elección Visitante | Momposino se conserva en localStorage y puede cambiarse desde el pie.
- Primera visita: el inicio muestra una tarjeta (no bloqueante) para elegir Visitante o Momposino; se puede cerrar y el cambio también está en el pie.
- La audiencia no oculta páginas; solo reordena los accesos rapidos del inicio y mensajes cortos.
- Contenido único en `content/`: labels ES/EN y lugares. Los mockups estáticos de `maquetado/` leen `content/places`; la app React importa desde `content/` también.
- El mapa usa MapLibre GL + teselas de OpenStreetMap y lugares estáticos en `content/places/places.json`; no requiere clave. Solo se muestran los lugares con `ubicacion_verificada: true` (ver `npm run places:report`).
- El contador de visitas no se muestra mientras no haya un servicio real de conteo. Ruta 404 y scroll-to-top incluidos.

## Formulario de contacto

Sin configuración, al enviar el formulario se abre **WhatsApp** con el mensaje ya escrito, dirigido al autor de `contacto.destinoId` en `content/*/labels.json` (por defecto `sebastian`).

Para recibir los mensajes por **correo**, crea un formulario gratis en [Formspree](https://formspree.io) y define la variable al compilar (en Vercel/Netlify: *Environment variables*; en local: archivo `.env.local`):

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxx
```

## Scripts útiles

- `npm run media:localize` — descarga a `public/media/images/` las imágenes que todavía se cargan desde Lovable y reescribe las rutas en `content/`, `Home.tsx` e `index.html`. Usa `-- --dry` para ver qué haría sin tocar nada. Se ejecuta una vez y se comitean las imágenes.
- `npm run places:report` — lista qué datos le faltan a cada lugar del mapa (coordenadas, horario, teléfono, foto).

## Cómo subir imágenes y audios (sin base de datos)

El sitio es 100% estático (Vite + React) y se despliega en Vercel/Netlify. **No necesitas base de datos**: cualquier archivo dentro de `public/` se copia tal cual al build y se sirve junto al sitio.

1. **Coloca tus archivos** en:
   - Imágenes → `public/media/images/`
   - Audios → `public/media/audio/`
2. **Referéncialos desde el contenido** (JSON en `content/`), con rutas relativas a `media/...`:
   - `content/es/labels.json` y `content/en/labels.json`:
     - Timeline: campo `"image"` por evento (los hitos reales de Mompox ya incluyen imágenes bajo licencia libre).
     - Galerías: `"galeria"` con `{ "src": "...", "caption": "..." }` (Semana Santa y Festival Jazz).
     - Símbolos: sección `"simbolos"` con bandera, escudo e himno (`content/es|en/labels.json`).
   - `content/places/places.json`: campo `"foto"` de cada lugar (se muestra en la ficha del mapa).
3. **Comitea y despliega.** `npm run build` empaqueta todo: verás tus archivos en `dist/media/`.

El código usa `import.meta.env.BASE_URL` + ruta (helper `src/helpers/mediaUrl.ts`), con `base: './'` en `vite.config.ts`, así las rutas funcionan en raíz y en subcarpetas.

### Medios incluidos
- `public/media/images/` → bandera y escudo oficiales (Wikimedia Commons, CC BY-SA) y fotos reales de Mompox para la línea de tiempo (iglesias, albarrada, calles y casonas coloniales). Créditos en la sección Historia.
- `public/media/images/muestra-mompox.svg` → ilustración de muestra en las galerías de Semana Santa y Festival Jazz.

> **Docker (dev):** el servidor Vite cachea el listado de `public/` al arrancar. Si añades imágenes/audios con el contenedor en marcha, **reinícialo** para que se sirvan: `docker compose restart web` (o `docker compose up -d --force-recreate web`). Si no, esos archivos nuevos devuelven `index.html` (imagen rota) hasta reiniciar.

### Nota de despliegue (SPA)
En Vercel/Netlify configura el redirect de SPA (todas las rutas → `index.html`) para que `/historia`, `/mapa`, etc. funcionen al recargar la página.

### Imagen para redes (og:image)
`og:image` en `index.html` debe ser una URL **absoluta**. `npm run media:localize` descarga la copia en `public/media/images/og-mompox.png`, pero deja la URL remota hasta que el sitio tenga dominio propio; entonces cámbiala por `https://TU-DOMINIO/media/images/og-mompox.png`.
