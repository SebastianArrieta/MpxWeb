import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { Link } from './LocaleLink'
import { useApp } from '../context/AppContext'
import Reveal from './Reveal'
import { mediaUrl } from '../helpers/mediaUrl'

type FotosDocumentales = {
  iglesia: string
  calles: string
  filigrana: string
}

type AficheItem = {
  id: string
  label: string
  sublabel: string
  src: string
  tone: string
}

type AfichesData = {
  eyebrow: string
  title: string
  intro: string
  hint: string
  prev: string
  next: string
  placeholderTag: string
  placeholderNote: string
  items: readonly AficheItem[]
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const

const LERP_FACTOR = 0.085
const STOP_EPSILON = 0.35
const EDGE_DEAD_MARGIN = 0.1

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function hasFinePointer() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: fine)').matches
  )
}

function FiligreeRule() {
  return (
    <div className="ss-filigree-rule" aria-hidden="true">
      <svg viewBox="0 0 360 18" fill="none" focusable="false">
        <line x1="0" y1="9" x2="146" y2="9" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
        <line x1="214" y1="9" x2="360" y2="9" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
        <path
          d="M146 9 C154 9, 158 4, 165 4 C170 4, 173 7, 175 9 C173 11, 170 14, 165 14 C159 14, 156 10.5, 160 8.5"
          stroke="currentColor"
          strokeWidth="0.95"
          strokeLinecap="round"
        />
        <path
          d="M214 9 C206 9, 202 4, 195 4 C190 4, 187 7, 185 9 C187 11, 190 14, 195 14 C201 14, 204 10.5, 200 8.5"
          stroke="currentColor"
          strokeWidth="0.95"
          strokeLinecap="round"
        />
        <path
          d="M180 4.5 L184.5 9 L180 13.5 L175.5 9 Z"
          stroke="currentColor"
          strokeWidth="0.95"
          strokeLinejoin="round"
        />
        <circle cx="180" cy="9" r="1.25" fill="currentColor" />
      </svg>
    </div>
  )
}

export default function SemanaSantaExperience() {
  const { labels } = useApp()
  const event = labels.semanaSanta

  const ext = event as typeof event & {
    posterTitle?: string
    colophon?: string
    fotosDocumentales?: FotosDocumentales
    afiches?: AfichesData
  }

  const posterTitle = ext.posterTitle ?? event.title
  const colophon = ext.colophon ?? labels.eventos.eyebrow
  const fotos: FotosDocumentales = ext.fotosDocumentales ?? {
    iglesia: posterTitle,
    calles: posterTitle,
    filigrana: posterTitle,
  }
  const afiches = ext.afiches

  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [finePointer, setFinePointer] = useState(hasFinePointer)
  const [progress, setProgress] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const targetScrollRef = useRef(0)
  const isHoveringRef = useRef(false)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartScrollRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const cancelGlide = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const syncScrollProgress = useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
    if (maxScroll <= 1) {
      setProgress(0)
      setCanScrollPrev(false)
      setCanScrollNext(false)
      return
    }
    const nextProgress = clamp(el.scrollLeft / maxScroll, 0, 1)
    setProgress(nextProgress)
    setCanScrollPrev(el.scrollLeft > 2)
    setCanScrollNext(el.scrollLeft < maxScroll - 2)
  }, [])

  const startGlide = useCallback(() => {
    if (rafRef.current !== null) return

    const step = () => {
      const el = viewportRef.current
      if (!el || isDraggingRef.current) {
        rafRef.current = null
        return
      }
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
      const target = clamp(targetScrollRef.current, 0, maxScroll)
      const diff = target - el.scrollLeft

      if (Math.abs(diff) < STOP_EPSILON) {
        el.scrollLeft = target
        rafRef.current = null
        return
      }

      el.scrollLeft += diff * LERP_FACTOR
      rafRef.current = window.requestAnimationFrame(step)
    }

    rafRef.current = window.requestAnimationFrame(step)
  }, [])

  const scrollToTarget = useCallback(
    (nextTarget: number) => {
      const el = viewportRef.current
      if (!el) return
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
      const clamped = clamp(nextTarget, 0, maxScroll)
      targetScrollRef.current = clamped

      if (reduced) {
        cancelGlide()
        el.scrollLeft = clamped
        syncScrollProgress()
        return
      }

      startGlide()
    },
    [cancelGlide, reduced, startGlide, syncScrollProgress],
  )

  const stepScroll = useCallback(
    (direction: -1 | 1) => {
      const el = viewportRef.current
      if (!el) return
      const stepSize = Math.max(280, el.clientWidth * 0.68)
      const base = rafRef.current !== null ? targetScrollRef.current : el.scrollLeft
      scrollToTarget(base + direction * stepSize)
    },
    [scrollToTarget],
  )

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerMq = window.matchMedia('(pointer: fine)')

    const onMotionChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    const onPointerChange = (e: MediaQueryListEvent) => setFinePointer(e.matches)

    motionMq.addEventListener('change', onMotionChange)
    pointerMq.addEventListener('change', onPointerChange)
    return () => {
      motionMq.removeEventListener('change', onMotionChange)
      pointerMq.removeEventListener('change', onPointerChange)
    }
  }, [])

  useEffect(() => {
    if (reduced) {
      cancelGlide()
    }
  }, [cancelGlide, reduced])

  useEffect(() => {
    syncScrollProgress()
    window.addEventListener('resize', syncScrollProgress)
    return () => {
      window.removeEventListener('resize', syncScrollProgress)
      cancelGlide()
    }
  }, [cancelGlide, syncScrollProgress])

  const handleViewportPointerEnter = useCallback(() => {
    isHoveringRef.current = true
  }, [])

  const handleViewportPointerLeave = useCallback(() => {
    isHoveringRef.current = false
  }, [])

  const handleViewportPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'touch' || e.button !== 0) return
      const el = viewportRef.current
      if (!el) return

      cancelGlide()
      isDraggingRef.current = true
      setIsDragging(true)
      dragStartXRef.current = e.clientX
      dragStartScrollRef.current = el.scrollLeft
      targetScrollRef.current = el.scrollLeft
      el.setPointerCapture(e.pointerId)
    },
    [cancelGlide],
  )

  const handleViewportPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const el = viewportRef.current
      if (!el) return

      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartXRef.current
        el.scrollLeft = dragStartScrollRef.current - deltaX
        targetScrollRef.current = el.scrollLeft
        return
      }

      if (reduced || !finePointer || e.pointerType === 'touch') return

      const maxScroll = el.scrollWidth - el.clientWidth
      if (maxScroll <= 1) return

      isHoveringRef.current = true
      const rect = el.getBoundingClientRect()
      const pad = rect.width * EDGE_DEAD_MARGIN
      const usableWidth = Math.max(1, rect.width - 2 * pad)
      const ratio = clamp((e.clientX - rect.left - pad) / usableWidth, 0, 1)

      targetScrollRef.current = ratio * maxScroll
      startGlide()
    },
    [finePointer, reduced, startGlide],
  )

  const handleViewportPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    const el = viewportRef.current
    if (el && el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId)
    }
    isDraggingRef.current = false
    setIsDragging(false)
    if (el) {
      targetScrollRef.current = el.scrollLeft
    }
  }, [])

  const handleViewportWheel = useCallback(
    (e: ReactWheelEvent<HTMLDivElement>) => {
      if (Math.abs(e.deltaX) > 0) {
        cancelGlide()
        const el = viewportRef.current
        if (el) {
          targetScrollRef.current = el.scrollLeft
        }
      }
    },
    [cancelGlide],
  )

  const handleViewportKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const el = viewportRef.current
      if (!el) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        stepScroll(-1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        stepScroll(1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        scrollToTarget(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        scrollToTarget(Math.max(0, el.scrollWidth - el.clientWidth))
      }
    },
    [scrollToTarget, stepScroll],
  )

  return (
    <div className={`page event-detail event-detail--semanaSanta ss-page${reduced ? ' is-reduced' : ''}`}>
      <header className="ss-poster-hero">
        <div className="ss-poster-hero__colophon">
          <span>{colophon}</span>
          <img
            className="ss-poster-hero__crest"
            src={mediaUrl('media/escudo-mompox.webp')}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
          />
          <span>{labels.eventos.eyebrow}</span>
        </div>

        <div className="ss-poster-hero__header">
          <h1 className="ss-poster-hero__title">{posterTitle}</h1>
          <p className="ss-poster-hero__tagline">{event.tagline}</p>
        </div>

        <div className="ss-poster-hero__plate">
          <img
            className="ss-poster-hero__img"
            src={mediaUrl(event.heroImage)}
            alt={posterTitle}
            loading="eager"
            decoding="async"
          />
        </div>

        <FiligreeRule />
      </header>

      <section className="ss-story">
        <Reveal className="ss-intro">
          <div className="ss-intro__text">
            <p className="ss-intro__eyebrow">{event.historiaTitle}</p>
            <p className="ss-intro__lead">{event.historiaText}</p>
          </div>
          <figure className="ss-intro__figure">
            <img
              src={mediaUrl('media/images/mompox-santa-barbara.jpg')}
              alt={fotos.iglesia}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{fotos.iglesia}</figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.05} className="ss-chapters-top">
          {event.sections.slice(0, 2).map((section, idx) => (
            <article
              key={section.title}
              className={`ss-chapter${idx === 1 ? ' ss-chapter--heritage' : ''}`}
            >
              <span className="ss-chapter__num">{String(idx + 1).padStart(2, '0')}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </Reveal>

        <Reveal delay={0.05} className="ss-diptych">
          <figure className="ss-diptych__fig ss-diptych__fig--wide">
            <img
              src={mediaUrl('media/images/mompox-calles.jpg')}
              alt={fotos.calles}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{fotos.calles}</figcaption>
          </figure>
          <figure className="ss-diptych__fig ss-diptych__fig--detail">
            <img
              src={mediaUrl('media/images/filigrana.jpg')}
              alt={fotos.filigrana}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{fotos.filigrana}</figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.05} className="ss-chapters-bottom">
          {event.sections.slice(2).map((section, idx) => (
            <article key={section.title} className="ss-chapter">
              <span className="ss-chapter__num">{String(idx + 3).padStart(2, '0')}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </Reveal>
      </section>

      <section className="ss-program" aria-labelledby="ss-programa-title">
        <Reveal className="ss-program__sheet">
          <div className="ss-program__head">
            <p className="page-header__eyebrow">{colophon}</p>
            <h2 id="ss-programa-title">{event.programaTitle}</h2>
            <p>{event.programaIntro}</p>
            <FiligreeRule />
          </div>

          <ol className="ss-program__list">
            {event.programa.map((item, i) => (
              <li key={item.dia} className="ss-program__row">
                <span className="ss-program__roman" aria-hidden="true">
                  {ROMAN[i] ?? String(i + 1)}
                </span>
                <strong className="ss-program__day">{item.dia}</strong>
                <span className="ss-program__desc">{item.texto}</span>
              </li>
            ))}
          </ol>

          <p className="ss-program__note">
            <span aria-hidden="true">✦</span> {event.programaNota}
          </p>
        </Reveal>
      </section>

      {afiches && afiches.items.length > 0 && (
        <section className="ss-afiches" aria-labelledby="ss-afiches-title">
          <Reveal className="ss-afiches__head">
            <div className="ss-afiches__copy">
              <p className="page-header__eyebrow">{afiches.eyebrow}</p>
              <h2 id="ss-afiches-title">{afiches.title}</h2>
              <p className="ss-afiches__intro">{afiches.intro}</p>
            </div>
            <div className="ss-afiches__controls">
              <span className="ss-afiches__hint">
                <span aria-hidden="true">↔</span> {afiches.hint}
              </span>
              <button
                type="button"
                className="ss-afiches__nav"
                onClick={() => stepScroll(-1)}
                aria-label={afiches.prev}
                disabled={!canScrollPrev}
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                className="ss-afiches__nav"
                onClick={() => stepScroll(1)}
                aria-label={afiches.next}
                disabled={!canScrollNext}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </Reveal>

          <div
            ref={viewportRef}
            className={`ss-afiches__viewport${isDragging ? ' is-dragging' : ''}`}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-labelledby="ss-afiches-title"
            onPointerEnter={handleViewportPointerEnter}
            onPointerMove={handleViewportPointerMove}
            onPointerLeave={handleViewportPointerLeave}
            onPointerDown={handleViewportPointerDown}
            onPointerUp={handleViewportPointerUp}
            onPointerCancel={handleViewportPointerUp}
            onWheel={handleViewportWheel}
            onKeyDown={handleViewportKeyDown}
            onScroll={syncScrollProgress}
          >
            <div className="ss-afiches__track">
              {afiches.items.map((item) => {
                const hasImage = item.src.trim().length > 0

                return (
                  <figure
                    key={item.id}
                    className={`ss-afiche ${hasImage ? 'ss-afiche--image' : 'ss-afiche--placeholder'} ss-afiche--tone-${item.tone}`}
                  >
                    <div className="ss-afiche__frame">
                      {hasImage ? (
                        <img
                          src={mediaUrl(item.src)}
                          alt={item.label}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                        />
                      ) : (
                        <div className="ss-afiche__sheet">
                          <span className="ss-afiche__tag">{afiches.placeholderTag}</span>
                          <img
                            className="ss-afiche__crest"
                            src={mediaUrl('media/escudo-mompox.webp')}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                          />
                          <p className="ss-afiche__sheet-title">{posterTitle}</p>
                          <p className="ss-afiche__sheet-note">{afiches.placeholderNote}</p>
                        </div>
                      )}
                    </div>
                    <figcaption className="ss-afiche__meta">
                      <strong>{item.label}</strong>
                      <span>{item.sublabel}</span>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          </div>

          <div className="ss-afiche__progress" aria-hidden="true">
            <span
              className="ss-afiche__progress-fill"
              style={{ transform: `scaleX(${0.1 + progress * 0.9})` }}
            />
          </div>
        </section>
      )}

      <Reveal>
        <aside className="ss-note" aria-labelledby="ss-note-title">
          <div className="ss-note__aside">
            <p className="page-header__eyebrow">{colophon}</p>
            <h2 id="ss-note-title">{event.consejosTitle}</h2>
            <img
              className="ss-note__crest"
              src={mediaUrl('media/escudo-mompox.webp')}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="ss-note__body">
            <ul className="ss-note__list">
              {event.consejos.map((tip) => (
                <li key={tip} className="ss-note__item">
                  <span className="ss-note__marker" aria-hidden="true">
                    ✦
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>

            <div className="ss-note__cta">
              <Link to="/contacto" className="btn btn--primary">
                {event.consulta} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </aside>
      </Reveal>
    </div>
  )
}
