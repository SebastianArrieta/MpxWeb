import { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'

type TimelineProps = {
  preview?: boolean
  showCultural?: boolean
}

const ERA_TONES = ['era-terracotta', 'era-teal', 'era-ink', 'era-terracotta', 'era-teal'] as const

export default function Timeline({ preview = false, showCultural = true }: TimelineProps) {
  const { labels } = useApp()
  const allEvents = labels.timeline
  const events = preview ? allEvents.slice(0, 3) : allEvents
  const [activeId, setActiveId] = useState(events[0]?.year ?? '')
  const [openId, setOpenId] = useState<string | null>(preview ? null : events[0]?.year ?? null)
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)

  const activeIndex = useMemo(
    () => Math.max(0, events.findIndex((e) => e.year === activeId)),
    [activeId, events],
  )

  useEffect(() => {
    if (preview) return
    const nodes = events
      .map((e) => itemRefs.current[e.year])
      .filter(Boolean) as HTMLLIElement[]
    if (!nodes.length) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      nodes.forEach((n) => n.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            const year = (entry.target as HTMLElement).dataset.year
            if (year) setActiveId(year)
          }
        }
      },
      { threshold: 0.45, rootMargin: '-20% 0px -35% 0px' },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [events, preview])

  useEffect(() => {
    if (preview) return
    const onScroll = () => {
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const view = window.innerHeight * 0.65
      const start = rect.top
      const total = rect.height - view
      const raw = (view - start) / Math.max(total, 1)
      setProgress(Math.min(1, Math.max(0, raw)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [preview])

  const jumpTo = (year: string) => {
    setActiveId(year)
    setOpenId(year)
    itemRefs.current[year]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
    <div className="timeline timeline--immersive" ref={trackRef}>
      <aside className="timeline-rail" aria-label={labels.timelineUi.railAria}>
        <div className="timeline-rail__progress" style={{ ['--p' as string]: progress }} />
        <ol className="timeline-rail__years">
          {events.map((e, i) => (
            <li key={e.year}>
              <button
                type="button"
                className={`timeline-rail__btn ${ERA_TONES[i % ERA_TONES.length]}${activeId === e.year ? ' is-active' : ''}`}
                aria-current={activeId === e.year ? 'step' : undefined}
                onClick={() => jumpTo(e.year)}
              >
                <span className="timeline-rail__index">{String(i + 1).padStart(2, '0')}</span>
                <span className="timeline-rail__label">{e.year}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="timeline-rail__status">
          {activeIndex + 1} / {events.length}
        </p>
      </aside>

      <ol className="timeline__list timeline__list--immersive">
        {events.map((event, index) => {
          const open = openId === event.year
          const tone = ERA_TONES[index % ERA_TONES.length]
          return (
            <li
              key={event.year}
              className={`timeline__item timeline__item--immersive ${tone}${activeId === event.year ? ' is-active' : ''}${open ? ' is-open' : ''}`}
              data-year={event.year}
              style={{ ['--i' as string]: index }}
              ref={(node) => {
                itemRefs.current[event.year] = node
              }}
            >
              <button
                type="button"
                className="timeline__hit"
                onClick={() => setOpenId(open ? null : event.year)}
                aria-expanded={open}
              >
                <div className="timeline__marker" aria-hidden="true">
                  <span className="timeline__dot" />
                </div>
                <article className="timeline__card timeline__card--immersive">
                  <div className="timeline__sticky-year">
                    <time className="timeline__year" dateTime={event.year}>
                      {event.year}
                    </time>
                    <span className="timeline__chip">
                      {open ? labels.timelineUi.close : labels.timelineUi.explore}
                    </span>
                  </div>
                  <h3 className="timeline__title">{event.title}</h3>
                  <div className={`timeline__detail-wrap${open ? ' is-expanded' : ''}`}>
                    <p className="timeline__detail">{event.detail}</p>
                  </div>
                </article>
              </button>
            </li>
          )
        })}
      </ol>

      {showCultural && (
        <div className="timeline__cultural">
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
    </div>
  )
}