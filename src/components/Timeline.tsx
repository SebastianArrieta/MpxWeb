import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { mediaUrl } from '../helpers/mediaUrl'

type TimelineProps = {
  preview?: boolean
  showCultural?: boolean
}

type TimelineEvent = {
  year: string
  title: string
  detail: string
  image?: string
  audio?: string
}

const ERA_TONES = ['era-terracotta', 'era-teal', 'era-ink', 'era-terracotta', 'era-teal'] as const

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function Timeline({ preview = false, showCultural = true }: TimelineProps) {
  const { labels } = useApp()
  const allEvents = labels.timeline as TimelineEvent[]
  const events = preview ? allEvents.slice(0, 3) : allEvents
  const [activeId, setActiveId] = useState(events[0]?.year ?? '')
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const sceneRefs = useRef<Record<string, HTMLElement | null>>({})
  const dotRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const rafRef = useRef(0)
  const percentRef = useRef<HTMLSpanElement | null>(null)

  const activeIndex = useMemo(
    () => Math.max(0, events.findIndex((e) => e.year === activeId)),
    [activeId, events],
  )

  // Progreso + parallax + hito activo (banda central con histéresis)
  useEffect(() => {
    if (preview) return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let current = activeId

    const compute = () => {
      const rect = wrapper.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = clamp01((vh * 0.62 - rect.top) / Math.max(rect.height, 1))
      wrapper.style.setProperty('--progress', String(progress))
      if (percentRef.current) percentRef.current.textContent = `${Math.round(progress * 100)}%`

      const vpCenter = vh / 2
      const band = vh * 0.52
      const margin = vh * 0.08
      let best: string | null = null
      let bestAbs = Infinity
      let currentAbs = Infinity

      for (const event of events) {
        const node = sceneRefs.current[event.year]
        if (!node) continue
        const r = node.getBoundingClientRect()
        const center = r.top + r.height / 2
        const dist = center - vpCenter
        const abs = Math.abs(dist)

        if (abs <= band && abs < bestAbs) {
          bestAbs = abs
          best = event.year
        }
        if (event.year === current) currentAbs = abs

        node.style.setProperty('--near', String(clamp01(1 - abs / (vh * 0.85))))
        node.style.setProperty('--off', String(clamp(dist / (vh * 0.85), -1, 1)))

        const dot = dotRefs.current[event.year]
        if (dot) {
          const relCenter = center - rect.top
          const pct = (relCenter / Math.max(rect.height, 1)) * 100
          dot.style.setProperty('--dot-y', `${pct}%`)
        }
      }

      if (best && best !== current && currentAbs - bestAbs > margin) {
        current = best
        setActiveId(best)
      }
    }

    const schedule = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        compute()
      })
    }

    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [events, preview])

  const jumpTo = (year: string) => {
    setActiveId(year)
    sceneRefs.current[year]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  if (preview) {
    return (
      <div className="timeline timeline--teaser">
        <div className="timeline-teaser__years">
          {events.map((e) => (
            <span key={e.year} className="timeline-teaser__year">
              {e.year}
            </span>
          ))}
        </div>
        <p className="timeline-teaser__copy">
          {labels.timelineUi.teaser
            .replace('{inicio}', events[0].title)
            .replace('{fin}', events[events.length - 1].title)}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="timeline timeline--scrolly" ref={wrapperRef}>
        <aside className="timeline-rail" aria-label={labels.timelineUi.railAria}>
        <div className="timeline-rail__head">
          <span className="timeline-rail__eyebrow">Río de Mompox</span>
          <strong className="timeline-rail__year">{activeId}</strong>
          <span className="timeline-rail__status">
            <span ref={percentRef}>0%</span>
            <span>
              {String(activeIndex + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}
            </span>
          </span>
        </div>

        <div className="timeline-rail__track" aria-hidden="true">
          <span className="timeline-rail__line" />
          <span className="timeline-rail__fill" />
          {events.map((e, i) => (
            <button
              key={e.year}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className={`timeline-rail__dot ${ERA_TONES[i % ERA_TONES.length]}${activeId === e.year ? ' is-active' : ''}`}
              ref={(node) => {
                dotRefs.current[e.year] = node
              }}
              onClick={() => jumpTo(e.year)}
            />
          ))}
        </div>

        <ol className="timeline-rail__years">
          {events.map((e, i) => (
            <li key={e.year}>
              <button
                type="button"
                className={`timeline-rail__btn ${ERA_TONES[i % ERA_TONES.length]}${activeId === e.year ? ' is-active' : ''}`}
                aria-current={activeId === e.year ? 'step' : undefined}
                onClick={() => jumpTo(e.year)}
              >
                <span className="timeline-rail__idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="timeline-rail__y">{e.year}</span>
              </button>
            </li>
          ))}
        </ol>
        </aside>

        <div className="timeline-scenes">
          {events.map((event, index) => {
            const tone = ERA_TONES[index % ERA_TONES.length]
            return (
              <section
                key={event.year}
                className={`timeline-scene ${tone}${activeId === event.year ? ' is-active' : ''}`}
                data-year={event.year}
                ref={(node) => {
                  sceneRefs.current[event.year] = node
                }}
              >
                <span className="timeline-scene__year" aria-hidden="true">
                  {event.year}
                </span>
                <div className="timeline-scene__card">
                  <header className="timeline-scene__card-head">
                    <span className="timeline-scene__index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="timeline-scene__title">{event.title}</h3>
                  </header>
                  {event.image ? (
                    <div className="timeline-scene__media">
                      <img src={mediaUrl(event.image)} alt="" loading="lazy" decoding="async" />
                    </div>
                  ) : null}
                  <p className="timeline-scene__detail">{event.detail}</p>
                  {event.audio ? (
                    <div className="timeline-scene__audio">
                      <audio controls preload="none" src={mediaUrl(event.audio)}>
                        Tu navegador no soporta audio.
                      </audio>
                    </div>
                  ) : null}
                </div>
              </section>
            )
          })}
        </div>
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
