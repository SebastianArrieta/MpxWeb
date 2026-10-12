import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useApp } from '../context/AppContext'
import { mediaUrl } from '../helpers/mediaUrl'

type TimelineProps = {
  showCultural?: boolean
}

type TimelineEvent = {
  year: string
  title: string
  detail: string
  image?: string
}

const TONES = 3
const AUTOPLAY_MS = 7000
const SCROLL_LOCK_MS = 800
const INTERACT_IDLE_MS = 900

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Timeline({ showCultural = true }: TimelineProps) {
  const { labels } = useApp()
  const events = labels.timeline as TimelineEvent[]
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const rafRef = useRef(0)
  const lockRef = useRef(0)
  const interactTimerRef = useRef(0)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion())
  const [isHovered, setIsHovered] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [isDocVisible, setIsDocVisible] = useState(true)
  const [isInView, setIsInView] = useState(true)

  const goTo = useCallback(
    (index: number) => {
      const i = Math.min(events.length - 1, Math.max(0, index))
      const viewport = viewportRef.current
      const node = cardRefs.current[events[i]?.year]
      if (!viewport || !node) return
      lockRef.current = Date.now() + SCROLL_LOCK_MS
      setActive(i)
      const vRect = viewport.getBoundingClientRect()
      const cRect = node.getBoundingClientRect()
      const delta = cRect.left + cRect.width / 2 - (vRect.left + vRect.width / 2)
      viewport.scrollTo({ left: viewport.scrollLeft + delta, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    },
    [events],
  )

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const update = () => {
      rafRef.current = 0
      const max = viewport.scrollWidth - viewport.clientWidth
      setProgress(max > 0 ? Math.min(1, Math.max(0, viewport.scrollLeft / max)) : 0)

      if (Date.now() < lockRef.current) return

      const vRect = viewport.getBoundingClientRect()
      const center = vRect.left + vRect.width / 2
      let best = 0
      let bestDist = Infinity
      events.forEach((event, i) => {
        const node = cardRefs.current[event.year]
        if (!node) return
        const r = node.getBoundingClientRect()
        const dist = Math.abs(r.left + r.width / 2 - center)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActive(best)
    }

    const schedule = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(update)
    }

    update()
    viewport.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      viewport.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [events])

  useEffect(() => {
    const onVisibility = () => setIsDocVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => setIsInView(entries[0]?.isIntersecting ?? true), {
      threshold: 0.25,
    })
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isPlaying || isHovered || isInteracting || !isDocVisible || !isInView) return
    if (events.length < 2) return
    const id = window.setTimeout(() => goTo((active + 1) % events.length), AUTOPLAY_MS)
    return () => window.clearTimeout(id)
  }, [isPlaying, isHovered, isInteracting, isDocVisible, isInView, active, events.length, goTo])

  useEffect(() => () => window.clearTimeout(interactTimerRef.current), [])

  const beginInteract = () => {
    setIsInteracting(true)
    window.clearTimeout(interactTimerRef.current)
  }
  const endInteract = () => {
    window.clearTimeout(interactTimerRef.current)
    interactTimerRef.current = window.setTimeout(() => setIsInteracting(false), INTERACT_IDLE_MS)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(active + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(active - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      goTo(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      goTo(events.length - 1)
    }
  }

  return (
    <>
      <div
        className="timeline2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsHovered(false)
        }}
      >
        <header className="timeline2__head">
          <p className="section__eyebrow">{labels.timelineUi.railEyebrow}</p>
          <div className="timeline2__controls">
            <span className="timeline2__counter" aria-hidden="true">
              {String(active + 1).padStart(2, '0')}
              <span className="timeline2__counterSep">/</span>
              {String(events.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className={`timeline2__toggle${isPlaying ? ' is-playing' : ''}`}
              onClick={() => setIsPlaying((value) => !value)}
              aria-pressed={isPlaying}
              aria-label={isPlaying ? labels.timelineUi.pause : labels.timelineUi.play}
              title={labels.timelineUi.autoplayAria}
            >
              {isPlaying ? (
                <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
                  <rect x="2" y="1.5" width="2.7" height="9" rx="1" fill="currentColor" />
                  <rect x="7.3" y="1.5" width="2.7" height="9" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
                  <path d="M3 1.6 10 6 3 10.4Z" fill="currentColor" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="timeline2__nav"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label={labels.timelineUi.prev}
            >
              ‹
            </button>
            <button
              type="button"
              className="timeline2__nav"
              onClick={() => goTo(active + 1)}
              disabled={active === events.length - 1}
              aria-label={labels.timelineUi.next}
            >
              ›
            </button>
          </div>
        </header>

        <div
          className="timeline2__viewport"
          ref={viewportRef}
          tabIndex={0}
          role="group"
          aria-label={labels.timelineUi.railAria}
          onKeyDown={onKeyDown}
          onPointerDown={beginInteract}
          onPointerUp={endInteract}
          onPointerCancel={endInteract}
          onWheel={() => {
            beginInteract()
            endInteract()
          }}
        >
          <ol className="timeline2__track">
            {events.map((event, i) => (
              <li
                key={event.year}
                className={`timeline2__card tone-${i % TONES}${i === active ? ' is-active' : ''}`}
                aria-current={i === active ? 'true' : undefined}
                ref={(node) => {
                  cardRefs.current[event.year] = node
                }}
              >
                <div className="timeline2__media">
                  {event.image ? (
                    <img src={mediaUrl(event.image)} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <span className="timeline2__watermark" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <div className="timeline2__body">
                  <span className="timeline2__year">{event.year}</span>
                  <h3 className="timeline2__cardTitle">{event.title}</h3>
                  <p className="timeline2__detail">{event.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="timeline2__bar" aria-hidden="true">
          <span className="timeline2__barFill" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <nav className="timeline2__pills" aria-label={labels.timelineUi.railAria}>
          {events.map((event, i) => (
            <button
              key={event.year}
              type="button"
              className={`timeline2__pill${i === active ? ' is-active' : ''}`}
              onClick={() => goTo(i)}
              aria-current={i === active ? 'true' : undefined}
            >
              {event.year}
            </button>
          ))}
        </nav>

        <p className="timeline2__hint">{labels.timelineUi.dragHint}</p>
      </div>

      {showCultural && (
        <div className="timeline-scrolly__cultural">
          <h3 className="timeline__cultural-title">{labels.timelineUi.culturalTitle}</h3>
          <p className="timeline__cultural-lead">{labels.timelineUi.culturalLead}</p>
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
    </>
  )
}
