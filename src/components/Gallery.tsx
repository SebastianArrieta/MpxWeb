import { useCallback, useEffect, useState } from 'react'
import { mediaUrl } from '../helpers/mediaUrl'

export type GalleryItem = { src: string; caption?: string; categoria?: string }

export default function Gallery({
  items,
  label,
}: {
  items: GalleryItem[]
  label?: string
}) {
  const [active, setActive] = useState<number | null>(null)

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
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
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
        <div className="gallery__lightbox" role="dialog" aria-modal="true" onClick={close}>
          <div className="gallery__frame" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="gallery__nav gallery__nav--prev" aria-label="Anterior" onClick={() => step(-1)}>
              ‹
            </button>
            <figure className="gallery__figure">
              <img src={mediaUrl(items[active].src)} alt={items[active].caption ?? ''} />
              <figcaption>{items[active].caption}</figcaption>
            </figure>
            <button type="button" className="gallery__nav gallery__nav--next" aria-label="Siguiente" onClick={() => step(1)}>
              ›
            </button>
            <button type="button" className="gallery__close" aria-label="Cerrar" onClick={close}>
              ×
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
