# Mompox Mágico — Guía de diseño

> Una ciudad de cal y teja a la orilla del Magdalena, contada como una revista de viaje.

Esta guía describe el sistema visual **tal como está implementado** en `src/styles/` y las reglas para extenderlo. Si cambias un token, actualiza también esta guía. (Reemplaza la guía anterior, que describía la marca de otra empresa y no correspondía al sitio.)

---

## 1. Identidad

- **Tono:** editorial, cálido, pausado. El sitio se siente como una guía impresa: tipografía con serifa para los títulos, fotos grandes de la ciudad y mucho aire.
- **Materiales de referencia:** la **cal** de las fachadas (fondo crema), el **ocre** de las casonas (acción principal), la **teja** de techos y ladrillo (acento), la **ceiba y el río** (verde profundo), el **barro** de la albarrada (texto secundario).
- **Lo que no es:** ni un sitio de agencia de viajes con azules corporativos, ni un folleto saturado. Un solo color fuerte por pantalla.

## 2. Color

Todas las variables globales viven en **`src/styles/tokens.css`** (un único `:root`, cargado antes que el resto del CSS). Los hex son la conversión aproximada a sRGB.

| Token | Valor | Hex ≈ | Uso |
|---|---|---|---|
| `--background` | `oklch(98.2% 0.012 84)` | `#fdf9f0` | Fondo de página (cal). |
| `--card` | `oklch(99.5% 0.006 84)` | `#fffdfa` | Tarjetas y superficies elevadas. |
| `--secondary` | `oklch(94% 0.022 84)` | `#f2eadb` | Bandas, cabeceras de evento, superficies suaves. |
| `--muted-surface` | `oklch(94.5% 0.017 84)` | `#f2ece0` | Fondo del mapa y estados vacíos. |
| `--border` | `oklch(88% 0.02 78)` | `#dfd6c9` | Bordes finos (1px) de tarjetas, inputs y separadores. |
| `--foreground` | `oklch(26% 0.028 55)` | `#2f2017` | Texto principal y títulos. |
| `--muted-foreground` | `oklch(50% 0.028 60)` | `#706053` | Texto secundario, pies de foto y ayudas. |
| `--primary` | `oklch(68% 0.142 72)` | `#cd8711` | **Ocre.** Relleno de botón principal, chip activo, bordes de acento, foco. |
| `--primary-foreground` | `oklch(21% 0.03 55)` | `#23140a` | Texto sobre el ocre. |
| `--primary-text` | `oklch(52% 0.12 68)` | `#935a00` | **Ocre para texto** sobre fondos claros (links, etiquetas, roles). |
| `--accent` / `--clay` | `oklch(56% 0.152 34)` | `#bd4b32` | **Teja.** Detalles, flechas, hover de links del pie. |
| `--accent-text` | `oklch(52% 0.14 34)` | `#aa442d` | Teja para texto pequeño (eyebrows) en cualquier fondo claro. |
| `--river` | `oklch(44% 0.062 168)` | `#2c5e4c` | **Río/ceiba.** Tarjetas *teal*, contrapunto frío. |
| `--palette-sand` | `oklch(93% 0.03 82)` | `#f2e6d2` | Eyebrows y eslogan sobre fotos oscuras. |

Los colores de categoría del mapa están en `src/pages/Mapa.tsx` (`categoryColors`).

### Contraste (WCAG AA)

| Combinación | Ratio | ¿Texto normal? |
|---|---|---|
| `--foreground` sobre `--background` | 14.9 | ✅ |
| `--muted-foreground` sobre `--background` | 5.7 | ✅ |
| `--primary-foreground` sobre `--primary` (botón) | 6.0 | ✅ |
| `--primary-text` sobre `--background` / `--secondary` | 5.4 / 4.7 | ✅ |
| `--accent-text` sobre `--background` / `--secondary` | 5.6 / 4.9 | ✅ |
| `--river` sobre `--background` | 7.1 | ✅ |
| **`--primary` (ocre) como texto sobre `--background`** | **2.8** | ❌ Nunca |
| `--accent` (teja) como texto sobre `--secondary` | 4.2 | ❌ Usa `--accent-text` |

**Regla:** `--primary` y `--accent` son para **rellenos, bordes e íconos**. Para **texto** usa `--primary-text` y `--accent-text`.

## 3. Tipografía

Se cargan desde Google Fonts en `index.html`.

| Familia | Token | Pesos | Uso |
|---|---|---|---|
| **Bodoni Moda** (serifa de alto contraste) | `--font-serif` | 400, 500, 600 | `h1`–`h4`, logo, eslogan en itálica, títulos de tarjetas. Peso por defecto **500**. |
| **Karla** (sans humanista) | `--font-sans` | 300–700 | Cuerpo, navegación, botones, formularios, etiquetas. |

Escala en uso:

| Rol | Tamaño | Notas |
|---|---|---|
| Título del hero | `clamp(4rem, 9vw, 6.5rem)` | `line-height: .95`, `letter-spacing: -0.035em`. |
| Título de sección | `clamp(2rem, 4vw, 2.5rem)` | Serifa 500. |
| Título de tarjeta | `~1.55rem` | Serifa. |
| Cuerpo | `1rem` (16px) | `line-height: 1.55`, máx. ~65 caracteres por línea. |
| Eyebrow / etiqueta | `0.72–0.78rem` | MAYÚSCULAS, `letter-spacing: 0.14–0.25em`, peso 700. |

- No uses Bodoni por debajo de ~18px: sus trazos finos se pierden.
- El eslogan *"La tierra de Dios…"* siempre en Bodoni itálica.

## 4. Forma, espacio y sombra

- **Radios:** `--radius: 0.35rem` (botones, inputs, chips) y `--radius-lg: 0.6rem` (tarjetas). Las tarjetas de inicio usan `calc(var(--radius) + 4px)`. Nada por encima de ~1rem salvo píldoras (botón *Mapa*, selector ES|EN).
- **Bordes:** 1px `--border`. Las tarjetas destacadas llevan un borde superior o izquierdo de 3–4px en `--primary`.
- **Sombra:** `--shadow` (suave, dos capas) en tarjetas; al pasar el mouse sube a `0 18px 38px rgba(50,37,26,.13)` con `translateY(-0.375rem)`. Los botones no llevan sombra.
- **Ancho de contenido:** `min(72rem, 100%)`. Espacio entre secciones: 3–4rem.

## 5. Componentes

| Componente | Clase | Reglas |
|---|---|---|
| Botón principal | `.btn.btn--primary` | Relleno `--primary`, texto `--primary-foreground`. **Uno por bloque.** Hover: ocre más oscuro. |
| Botón secundario | `.btn.btn--ghost` | Transparente, borde fino. Sobre fotos: borde y texto en cal. |
| Tarjeta de contenido | `.info-card` | `--card`, borde 1px, `--radius-lg`. Variantes `--accent` (borde superior ocre) y `--teal`. |
| Tarjeta de inicio | `.start-card` | Foto arriba (13rem), título en serifa, "Explorar →" en teja. |
| Etiqueta | `.info-card__tag` | Eyebrow en `--primary-text`. |
| Chip de filtro | `.chip-filter` | Activo = relleno ocre. Alto mínimo de 40px en táctil. |
| Pregunta de perfil | `.audience-prompt` | Tarjeta en el inicio, borde izquierdo ocre, botón de cerrar de 44px. **No bloquea** la navegación. |
| Eyebrow de página | `.page-header__eyebrow` | `--accent-text`, mayúsculas espaciadas. |

## 6. Imágenes

- **Fotos reales de Mompox**, con luz cálida (atardecer en la albarrada, fachadas encaladas, procesiones). Evita los bancos de imágenes genéricos.
- Todas las imágenes viven en `public/media/images/` y se referencian con `mediaUrl()`. **No enlazar imágenes alojadas en otros sitios.**
- Formato preferido: WebP o AVIF, con un ancho máximo de 1920px para el hero y 1200px para las tarjetas.
- Siempre con `alt` descriptivo (o `alt=""` si es decorativa), y con el crédito y la licencia en la sección Historia o en el pie de foto cuando aplique (p. ej. Wikimedia Commons CC BY-SA).
- Sobre fotos, el texto va encima de un degradado oscuro (`.hero__shade`) y nunca directo sobre la imagen.

## 7. Movimiento

- Curva estándar: `--ease: cubic-bezier(0.22, 1, 0.36, 1)`. Duraciones entre 0.4 y 0.8s.
- Animaciones permitidas: fundido + desplazamiento corto al aparecer (`Reveal`), zoom lento del hero (Ken Burns) y una ligera elevación de las tarjetas en hover.
- Todo respeta `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` y las media queries).
- Evita animar `filter: blur()` en elementos grandes: pesa en celulares de gama baja.

## 8. Accesibilidad (mínimos)

- Contraste AA en todo el texto (ver tabla). Comprueba cualquier color nuevo antes de usarlo.
- Áreas táctiles de 44×44px como mínimo.
- Foco visible: `outline: 3px solid rgba(189, 89, 61, .38)` con `outline-offset: 3px` (regla global en `index.css`). No lo quites.
- Nada de modales que bloqueen la primera visita.
- Mantén el *skip link*, los `aria-label` de la navegación y los textos alternativos en ES y EN.

## 9. Sí / No

**Sí**
- Usar el ocre para **una** acción principal por pantalla.
- Mantener los títulos en Bodoni 500 y el cuerpo en Karla.
- Escribir todo texto nuevo en `content/es` y `content/en` (nunca en el componente).

**No**
- Ocre o teja como color de texto pequeño (usa las variantes `-text`).
- Introducir azules: el antiguo `--color-signal-blue` hoy apunta al ocre y no debe usarse en código nuevo.
- Sombras en botones, radios grandes o degradados de colores.
- Imágenes enlazadas desde dominios externos.

## 10. Deuda técnica de estilos

- ✅ **Resuelto:** los tres bloques `:root` superpuestos de `index.css` y `mompox.css` se unificaron en `src/styles/tokens.css`, con los valores que realmente se aplicaban, y se eliminaron 10 variables sin uso. Se verificó píxel a píxel en 14 rutas (escritorio y móvil): sin cambios visuales.
- **Pendiente:** los **alias heredados** (`--terracotta` = teja, `--teal` = color del texto, `--color-signal-blue` = ocre, `--mpx-cielo` = verde río, …) siguen en `tokens.css`, agrupados y marcados como obsoletos, porque el CSS antiguo todavía los usa. Al tocar una regla, cámbiala al nombre semántico (`--primary`, `--accent`, `--river`, `--foreground`, …); cuando ningún alias tenga usos, se borra.
- **Pendiente:** muchas reglas se sobrescriben en cascada entre `index.css` y `mompox.css` (p. ej. `.btn--primary`, `.site-footer`). Unificar cada componente en una sola regla reduciría el CSS (~159 KB) y evitaría sorpresas.
