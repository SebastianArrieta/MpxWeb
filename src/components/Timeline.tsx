import { useEffect, useRef } from 'react'
import labels from '../data/labels.json'

type TimelineProps = {
  /** Compact preview for Home */
  preview?: boolean
  showCultural?: boolean
}

export default function Timeline({ preview = false, showCultural = true }: TimelineProps) {
  const events = preview ? labels.timeline.slice(0, 4) : labels.timeline
  const listRef = useRef<HTMLOListElement | null>(null)

  useEffect(() => {
    const root = listRef.current
    if (!root) return

    const items = root.querySelectorAll('.timeline__item')
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      items.forEach((item) => item.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        }
      },
      { threshold: 0.22, rootMargin: '0px 0px -10% 0px' },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [preview])

  return (
    <div className={`timeline ${preview ? 'timeline--preview' : ''}`}>
      <ol className="timeline__list" ref={listRef}>
        {events.map((event, index) => (
          <li
            key={event.year}
            className="timeline__item"
            style={{ ['--i' as string]: index }}
          >
            <div className="timeline__marker" aria-hidden="true">
              <span className="timeline__dot" />
            </div>
            <article className="timeline__card">
              <time className="timeline__year" dateTime={event.year}>
                {event.year}
              </time>
              <h3 className="timeline__title">{event.title}</h3>
              <p className="timeline__detail">{event.detail}</p>
            </article>
          </li>
        ))}
      </ol>

      {!preview && showCultural && (
        <div className="timeline__cultural">
          <h3 className="timeline__cultural-title">Hitos culturales</h3>
          <p className="timeline__cultural-lead">
            Tradiciones vivas del calendario momposino (sin año fijo inventado).
          </p>
          <div className="timeline__cultural-grid">
            {labels.culturalMilestones.map((item) => (
              <article key={item.title} className="timeline__cultural-card">
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
