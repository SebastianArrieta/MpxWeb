# MpxWeb — maquetado (scaffold)

Sitio turístico de **Santa Cruz de Mompox**: solo layout/estructura (Vite + React + React Router + TypeScript). Sin APIs reales ni Lovable Cloud.

## Cómo correr en local

```bash
cd MpxWeb-maquetado
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
- `/mapa` – Mapa (shell)
- `/tours` – Tours
- `/autor` – Autor
- `/contacto` – Contacto

## Notas del maquetado

- Barra superior: logo ¼Mompox», navegación, toggle ES|EN (bilingüe real; copy EN provisional en `content/en/labels.json`), chip Visitante | Momposino (persistido en localStorage), contador de visitas fijo en 0.
- Primera visita: pantalla de bienvenida para elegir audiencia.
- La audiencia no oculta páginas; solo reordena los accesos rapidos del inicio y mensajes cortos.
- Contenido único en `content/`: labels ES/EN y lugares. Los mockups estáticos de `maquetado/` leen `content/places`; la app React importa desde `content/` también.
- Mapa y contador son placeholders (sin claves ni backend). Ruta 404 y scroll-to-top incluidos.

## Publicar en GitHub

Sebastián debe copiar estos archivos al repositorio SebastianArrieta/MpxWeb y hacer push el mismo:

```bash
cp -R /ruta/a/MpxWeb-maquetado/. /ruta/a/MpxWeb/
cd /ruta/a/MpxWeb
git add .
git commit -m "Maquetado inicial Mompox (Vite + React)"
git push
```

No hace falta subir node_modules; en el remoto basta con el codigo fuente y el package.json.

## Cómo subir imágenes y audios (sin base de datos)

El sitio es 100% estático (Vite + React) y se despliega en Vercel/Netlify. **No necesitas base de datos**: cualquier archivo dentro de `public/` se copia tal cual al build y se sirve junto al sitio.

1. **Coloca tus archivos** en:
   - Imágenes → `public/media/images/`
   - Audios → `public/media/audio/`
2. **Referéncialos desde el contenido** (JSON en `content/`), con rutas relativas a `media/...`:
   - `content/es/labels.json` y `content/en/labels.json`:
     - Timeline: campo `"image"` y `"audio"` por evento (la muestra está en el evento `1995`).
     - Galerías: `"galeria"` con `{ "src": "...", "caption": "..." }` (Semana Santa y Festival Jazz).
   - `content/places/places.json`: campo `"foto"` de cada lugar (se muestra en la ficha del mapa).
3. **Comitea y despliega.** `npm run build` empaqueta todo: verás tus archivos en `dist/media/`.

El código usa `import.meta.env.BASE_URL` + ruta (helper `src/helpers/mediaUrl.ts`), con `base: './'` en `vite.config.ts`, así las rutas funcionan en raíz y en subcarpetas.

### Muestra incluida
- `public/media/images/muestra-mompox.svg` → ilustración de Mompox (hero, evento 1995, galerías, mapa).
- `public/media/audio/muestra.wav` → chime de muestra en el evento 1995 (se expande la card para oírlo).

Para usar tus propios archivos, reemplaza los `muestra.*` (mantén el mismo nombre) o cambia las rutas en los JSON. Si un lugar/evento **no tiene** `image`/`audio`, se muestra el diseño anterior sin romperse.

### Nota de despliegue (SPA)
En Vercel/Netlify configura el redirect de SPA (todas las rutas → `index.html`) para que `/historia`, `/mapa`, etc. funcionen al recargar la página.
