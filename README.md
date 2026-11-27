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

Cada página existe en español en la raíz y en inglés bajo `/en` (p. ej. `/mapa` y `/en/mapa`). El idioma lo decide la URL; el selector ES|EN lleva a la misma página en el otro idioma. En el código usa `Link`/`NavLink` de `src/components/LocaleLink.tsx` (no los de `react-router-dom`) para que los enlaces internos conserven el idioma.


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

## SEO y vistas previas al compartir

Título, descripción e imagen de cada página viven en **`content/seo.json`** (ES y EN). Con eso:

- `useSeo` actualiza el `<head>` al navegar y al cambiar de idioma, con `hreflang` entre la versión en español y la inglesa.
- `npm run build` ejecuta al final `scripts/seo-build.mjs`, que genera `dist/<ruta>/index.html` y `dist/en/<ruta>/index.html` con las etiquetas de cada página (lo que leen WhatsApp, Facebook y Google sin ejecutar JS), `robots.txt` y `sitemap.xml` (con ambas versiones de cada página). La página principal incluye datos estructurados de schema.org (`WebSite` y `TouristDestination`).

**Al publicar, define `VITE_SITE_URL`** (ver `.env.example`), p. ej. `https://mompoxmagico.com`. Sin ella no se generan `canonical`, `og:image` ni `sitemap.xml`, porque necesitan URLs absolutas. En Docker: `docker build --build-arg VITE_SITE_URL=https://... .`

Para una página nueva: añádela a `content/seo.json` con `path`, `image` y los textos `es`/`en` (descripción de 120–160 caracteres).

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

El código usa `import.meta.env.BASE_URL` + ruta (helper `src/helpers/mediaUrl.ts`), con `base: '/'` en `vite.config.ts` (para publicar en una subcarpeta, define `VITE_BASE=/subcarpeta/`).

### Medios incluidos
- `public/media/images/` → bandera y escudo oficiales (Wikimedia Commons, CC BY-SA) y fotos reales de Mompox para la línea de tiempo (iglesias, albarrada, calles y casonas coloniales). Créditos en la sección Historia.
- `public/media/images/muestra-mompox.svg` → ilustración de muestra en las galerías de Semana Santa y Festival Jazz.

> **Docker (dev):** el servidor Vite cachea el listado de `public/` al arrancar. Si añades imágenes/audios con el contenedor en marcha, **reinícialo** para que se sirvan: `docker compose restart web` (o `docker compose up -d --force-recreate web`). Si no, esos archivos nuevos devuelven `index.html` (imagen rota) hasta reiniciar.

## Publicar el sitio

El build (`npm run build`) genera en `dist/` una página HTML por ruta (ES y EN), `404.html`, `sitemap.xml` y `robots.txt`. Sirve en cualquier hosting estático. Define siempre `VITE_SITE_URL` con la dirección final.

### Opción A — GitHub Pages (automático con cada push a `main`)
El flujo `.github/workflows/deploy-pages.yml` compila y publica en `https://sebastianarrieta.github.io/MpxWeb/`.
1. **Requisito:** GitHub Pages en repos **privados** exige un plan de pago (GitHub Pro o superior). Con el plan gratuito, el repo debe ser público.
2. En **Settings → Pages → Build and deployment → Source**, elige **GitHub Actions** (una sola vez).
3. Haz push a `main` o ejecuta el flujo a mano desde la pestaña **Actions**.
4. Con dominio propio: en **Settings → Secrets and variables → Actions → Variables** define `SITE_URL=https://tu-dominio.com` y `BASE_PATH=/`, y configura el dominio en **Settings → Pages**. Opcional: `FORMSPREE_ENDPOINT`.

### Opción B — Vercel o Netlify (gratis también con repo privado)
Importa el repo desde su panel y configura:
- **Build command:** `npm run build` · **Output directory:** `dist`
- **Variable de entorno:** `VITE_SITE_URL=https://<la-dirección-que-te-asignen>` (y `VITE_FORMSPREE_ENDPOINT` si usas Formspree).
No hace falta configurar redirects: cada ruta tiene su `index.html` y las demás reciben `404.html`.

### Opción C — Docker / nginx
`docker build --build-arg VITE_SITE_URL=https://... -t mpxweb . && docker run -p 8080:80 mpxweb`. El `nginx.conf` incluido ya sirve las rutas, el 404 y el worker `.mjs` del mapa.
