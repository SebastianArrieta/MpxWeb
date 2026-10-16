import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
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

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Timeline({ showCultural = true }: TimelineProps) {
  const { labels } = useApp()
  const events = labels.timeline as TimelineEvent[]
  const stageRef = useRef<HTMLDivElement | null>(null)
  const hitoRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const reduced = useRef(prefersReducedMotion()).current
  const [active, setActive] = useState(0)
  const [isLive, setIsLive] = useState(false)

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start 72%', 'end 55%'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 })
  const waterClip = useTransform(smoothProgress, [0, 1], ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'])

  const goTo = useCallback(
    (index: number) => {
      const i = Math.min(events.length - 1, Math.max(0, index))
      setActive(i)
      hitoRefs.current[events[i]?.year]?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'center',
      })
    },
    [events, reduced],
  )

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let raf = 0
    const update = () => {
      raf = 0
      const center = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity
      events.forEach((event, i) => {
        const node = hitoRefs.current[event.year]
        if (!node) return
        const r = node.getBoundingClientRect()
        const dist = Math.abs(r.top + r.height / 2 - center)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActive((prev) => (prev === best ? prev : best))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [events])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => setIsLive(entries[0]?.isIntersecting ?? false), {
      threshold: 0.15,
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(active + 1)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
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
        className={`rio${isLive ? ' is-live' : ''}${reduced ? ' is-reduced' : ''}`}
        role="group"
        aria-label={labels.timelineUi.railAria}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <header className="rio__head">
          <div className="rio__heading">
            <p className="section__eyebrow">{labels.timelineUi.railEyebrow}</p>
            <p className="rio__lead">{labels.timelineUi.railLead}</p>
          </div>
          <div className="rio__controls">
            <span className="rio__counter" aria-hidden="true">
              {String(active + 1).padStart(2, '0')}
              <span className="rio__counterSep">/</span>
              {String(events.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="rio__nav"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label={labels.timelineUi.prev}
            >
              ↑
            </button>
            <button
              type="button"
              className="rio__nav"
              onClick={() => goTo(active + 1)}
              disabled={active === events.length - 1}
              aria-label={labels.timelineUi.next}
            >
              ↓
            </button>
          </div>
        </header>

        <div className="rio__stage" ref={stageRef}>
          <div className="rio__cauce" aria-hidden="true">
            <motion.span
              className="rio__water"
              style={{ clipPath: reduced ? 'inset(0 0 0% 0)' : waterClip }}
            >
              <span className="rio__flow" />
            </motion.span>
          </div>

          <ol className="rio__hitos">
            {events.map((event, i) => {
              const side = i % 2 === 0 ? 'left' : 'right'
              const state = i === active ? ' is-active' : i < active ? ' is-reached' : ''
              return (
                <li
                  key={event.year}
                  ref={(node) => {
                    hitoRefs.current[event.year] = node
                  }}
                  className={`rio__hito rio__hito--${side}${state}`}
                  aria-current={i === active ? 'true' : undefined}
                >
                  <svg className="rio__brazo" viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <path d="M0 18 C 36 2, 78 34, 120 18" />
                  </svg>

                  <button
                    type="button"
                    className="rio__nodo"
                    onClick={() => goTo(i)}
                    aria-label={`${event.year} · ${event.title}`}
                    aria-current={i === active ? 'true' : undefined}
                  >
                    <span className="rio__nodoYear">{event.year}</span>
                  </button>

                  <article className="rio__card">
                    {event.image && (
                      <div className="rio__media">
                        <img src={mediaUrl(event.image)} alt="" loading="lazy" decoding="async" />
                      </div>
                    )}
                    <div className="rio__body">
                      <span className="rio__year">{event.year}</span>
                      <h3 className="rio__cardTitle">{event.title}</h3>
                      <p className="rio__detail">{event.detail}</p>
                    </div>
                  </article>
                </li>
              )
            })}
          </ol>
        </div>

        <p className="rio__hint">{labels.timelineUi.dragHint}</p>
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
