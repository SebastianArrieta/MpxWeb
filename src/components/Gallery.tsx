import { useCallback, useEffect, useRef, useState } from 'react'
import { mediaUrl } from '../helpers/mediaUrl'
import { useApp } from '../context/AppContext'

export type GalleryItem = { src: string; caption?: string; categoria?: string }

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function Gallery({
  items,
  label,
}: {
  items: GalleryItem[]
  label?: string
}) {
  const { labels } = useApp()
  const visor = labels.galeriaPagina.visor
  const [active, setActive] = useState<number | null>(null)
  const isOpen = active !== null
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((prev) => {
        if (prev === null) return prev
        return (prev + dir + items.length) % items.length
      }),
    [items.length],
  )

  useEffect(() => {
    if (!isOpen) return
    lastFocused.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => lastFocused.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key === 'ArrowRight') {
        step(1)
        return
      }
      if (e.key === 'ArrowLeft') {
        step(-1)
        return
      }
      if (e.key === 'Tab') {
        const dialog = dialogRef.current
        if (!dialog) return
        const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const current = document.activeElement
        if (e.shiftKey && (current === first || !dialog.contains(current))) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && (current === last || !dialog.contains(current))) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, close, step])

  if (items.length === 0) return null

  return (
    <div className="gallery" aria-label={label}>
      <div className="gallery__grid">
        {items.map((item, i) => (
          <button
            key={item.src + i}
            type="button"
            className="gallery__tile"
            onClick={() => setActive(i)}
            aria-label={item.caption ?? `Imagen ${i + 1}`}
          >
            <img src={mediaUrl(item.src)} alt={item.caption ?? ''} loading="lazy" decoding="async" />
            {item.caption ? <span className="gallery__tile-caption">{item.caption}</span> : null}
          </button>
        ))}
      </div>

      {active !== null && items[active] ? (
        <div
          className="gallery__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={visor.aria}
          ref={dialogRef}
          onClick={close}
        >
          <div className="gallery__frame" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="gallery__nav gallery__nav--prev" aria-label={visor.anterior} onClick={() => step(-1)}>
              ‹
            </button>
            <figure className="gallery__figure">
              <img src={mediaUrl(items[active].src)} alt={items[active].caption ?? ''} />
              <figcaption>{items[active].caption}</figcaption>
            </figure>
            <button type="button" className="gallery__nav gallery__nav--next" aria-label={visor.siguiente} onClick={() => step(1)}>
              ›
            </button>
            <button type="button" className="gallery__close" aria-label={visor.cerrar} ref={closeRef} onClick={close}>
              ×
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
