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
