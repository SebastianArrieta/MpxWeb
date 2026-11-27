import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Link } from './LocaleLink'
import { useApp } from '../context/AppContext'
import Reveal from './Reveal'
import { mediaUrl } from '../helpers/mediaUrl'

type EnsembleItem = {
  id: string
  name: string
  role: string
  detail: string
}

type EnsembleData = {
  eyebrow: string
  title: string
  lead: string
  soundHint: string
  items: readonly EnsembleItem[]
}

type SpreadArt = {
  primary: string
  secondary?: string
}

type CursorNote = {
  id: number
  x: number
  y: number
  dx: number
  rot: number
  glyph: string
}

type WebkitWindow = Window & {
  webkitAudioContext?: typeof AudioContext
}

const SPREAD_ART: readonly SpreadArt[] = [
  // 0 · Cuándo es
  { primary: 'farol-colonial.webp', secondary: 'luna-palma.webp' },
  // 1 · Jazz frente a las iglesias
  { primary: 'fachada-nocturna.webp', secondary: 'notas-musicales.webp' },
  // 2 · Encuentro de músicos
  { primary: 'gaitas.webp', secondary: 'notas-musicales.webp' },
  // 3 · Más que conciertos
  { primary: 'mecedora-sombrero.webp', secondary: 'bateria-jazz.webp' },
]

const ENSEMBLE_ART: Record<string, SpreadArt> = {
  saxofon: { primary: 'saxofon.webp' },
  trompeta: { primary: 'trompeta.webp' },
  caribe: { primary: 'tambores.webp', secondary: 'gaitas.webp' },
  ritmo: { primary: 'contrabajo.webp', secondary: 'bateria-jazz.webp' },
}

const ROMAN = ['I', 'II', 'III'] as const
const NOTE_GLYPHS = ['♪', '♫', '♩'] as const

const MAX_CURSOR_NOTES = 12
const NOTE_LIFETIME_MS = 950
const TRAIL_THROTTLE_MS = 105
const TRAIL_MIN_DIST_PX = 28
const PLAYING_DURATION_MS = 950

function jazzArt(file: string) {
  return mediaUrl(`media/illustrations/jazz/${file}`)
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

function scheduleTone(
  ctx: AudioContext,
  destination: AudioNode,
  {
    type,
    freq,
    endFreq,
    startTime,
    duration,
    peakGain,
    attack = 0.025,
  }: {
    type: OscillatorType
    freq: number
    endFreq?: number
    startTime: number
    duration: number
    peakGain: number
    attack?: number
  },
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, startTime)
  if (endFreq !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 20), startTime + duration)
  }

  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.linearRampToValueAtTime(peakGain, startTime + attack)
  gain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration)

  osc.connect(gain)
  gain.connect(destination)

  osc.start(startTime)
  osc.stop(startTime + duration + 0.02)
}

function playMotifWithContext(ctx: AudioContext, id: string) {
  const now = ctx.currentTime + 0.01

  if (id === 'trompeta') {
    // Bright Harmon-muted brass G9 motif
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1450, now)
    filter.frequency.exponentialRampToValueAtTime(980, now + 0.82)
    filter.Q.value = 1.4
    filter.connect(ctx.destination)

    const notes = [
      { freq: 392.0, offset: 0, dur: 0.24 },
      { freq: 493.88, offset: 0.16, dur: 0.22 },
      { freq: 587.33, offset: 0.31, dur: 0.24 },
      { freq: 659.25, offset: 0.47, dur: 0.38 },
    ]
    for (const n of notes) {
      scheduleTone(ctx, filter, {
        type: 'triangle',
        freq: n.freq,
        startTime: now + n.offset,
        duration: n.dur,
        peakGain: 0.048,
        attack: 0.018,
      })
      scheduleTone(ctx, filter, {
        type: 'sawtooth',
        freq: n.freq,
        startTime: now + n.offset,
        duration: n.dur,
        peakGain: 0.02,
        attack: 0.018,
      })
    }
    return
  }

  if (id === 'caribe') {
    // Warm wooden drum double-tap + coastal gaita pentatonic fifth
    const drumFilter = ctx.createBiquadFilter()
    drumFilter.type = 'lowpass'
    drumFilter.frequency.value = 460
    drumFilter.Q.value = 1.2
    drumFilter.connect(ctx.destination)

    scheduleTone(ctx, drumFilter, {
      type: 'sine',
      freq: 158,
      endFreq: 86,
      startTime: now,
      duration: 0.12,
      peakGain: 0.075,
      attack: 0.006,
    })
    scheduleTone(ctx, drumFilter, {
      type: 'sine',
      freq: 196,
      endFreq: 112,
      startTime: now + 0.13,
      duration: 0.11,
      peakGain: 0.062,
      attack: 0.006,
    })

    const gaitaFilter = ctx.createBiquadFilter()
    gaitaFilter.type = 'lowpass'
    gaitaFilter.frequency.value = 1650
    gaitaFilter.Q.value = 0.9
    gaitaFilter.connect(ctx.destination)

    const gaitaNotes = [
      { freq: 587.33, offset: 0.23, dur: 0.24 },
      { freq: 659.25, offset: 0.41, dur: 0.22 },
      { freq: 783.99, offset: 0.55, dur: 0.32 },
    ]
    for (const n of gaitaNotes) {
      scheduleTone(ctx, gaitaFilter, {
        type: 'sine',
        freq: n.freq,
        startTime: now + n.offset,
        duration: n.dur,
        peakGain: 0.056,
        attack: 0.032,
      })
      scheduleTone(ctx, gaitaFilter, {
        type: 'triangle',
        freq: n.freq * 2,
        startTime: now + n.offset,
        duration: n.dur * 0.85,
        peakGain: 0.012,
        attack: 0.04,
      })
    }
    return
  }

  if (id === 'ritmo') {
    // Warm plucked upright bass walk
    const bassFilter = ctx.createBiquadFilter()
    bassFilter.type = 'lowpass'
    bassFilter.frequency.value = 480
    bassFilter.Q.value = 1.6
    bassFilter.connect(ctx.destination)

    const walk = [110.0, 130.81, 146.83, 164.81]
    walk.forEach((freq, i) => {
      const startTime = now + i * 0.19
      const dur = i === walk.length - 1 ? 0.28 : 0.22
      scheduleTone(ctx, bassFilter, {
        type: 'sine',
        freq,
        startTime,
        duration: dur,
        peakGain: 0.06,
        attack: 0.009,
      })
      scheduleTone(ctx, bassFilter, {
        type: 'triangle',
        freq,
        startTime,
        duration: dur * 0.8,
        peakGain: 0.02,
        attack: 0.008,
      })
    })
    return
  }

  // Default & 'saxofon': warm velvet Dm9 arpeggio
  const saxFilter = ctx.createBiquadFilter()
  saxFilter.type = 'lowpass'
  saxFilter.frequency.setValueAtTime(980, now)
  saxFilter.frequency.exponentialRampToValueAtTime(760, now + 0.84)
  saxFilter.Q.value = 1.1
  saxFilter.connect(ctx.destination)

  const dm9 = [293.66, 349.23, 440.0, 523.25]
  dm9.forEach((freq, i) => {
    scheduleTone(ctx, saxFilter, {
      type: 'triangle',
      freq,
      startTime: now + i * 0.15,
      duration: i === dm9.length - 1 ? 0.4 : 0.3,
      peakGain: 0.068,
      attack: 0.036,
    })
  })
}

export default function FestijazzExperience() {
  const { labels } = useApp()
  const event = labels.festivalJazz
  const ensemble =
    'ensemble' in event
      ? (event as typeof event & { ensemble?: EnsembleData }).ensemble
      : undefined

  const [reduced, setReduced] = useState(prefersReducedMotion)
  const [finePointer, setFinePointer] = useState(hasFinePointer)
  const [notes, setNotes] = useState<CursorNote[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)

  const noteIdRef = useRef(0)
  const glyphIdxRef = useRef(0)
  const lastSpawnTimeRef = useRef(0)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const noteTimersRef = useRef<Set<number>>(new Set())
  const playingTimerRef = useRef<number | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

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
      setNotes([])
    }
  }, [reduced])

  useEffect(() => {
    const timers = noteTimersRef.current
    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId))
      timers.clear()
      if (playingTimerRef.current !== null) {
        window.clearTimeout(playingTimerRef.current)
        playingTimerRef.current = null
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        void audioCtxRef.current.close().catch(() => {})
        audioCtxRef.current = null
      }
    }
  }, [])

  const pushNotes = useCallback((batch: CursorNote[]) => {
    if (batch.length === 0) return
    setNotes((prev) => [...prev, ...batch].slice(-MAX_CURSOR_NOTES))

    const ids = new Set(batch.map((n) => n.id))
    const timerId = window.setTimeout(() => {
      noteTimersRef.current.delete(timerId)
      setNotes((prev) => prev.filter((n) => !ids.has(n.id)))
    }, NOTE_LIFETIME_MS)
    noteTimersRef.current.add(timerId)
  }, [])

  const spawnBurst = useCallback(
    (x: number, y: number) => {
      if (reduced) return
      const arcOffsets = [
        { ox: -14, oy: -4, dx: -34, rot: -18 },
        { ox: -4, oy: -10, dx: -12, rot: -7 },
        { ox: 6, oy: -10, dx: 14, rot: 8 },
        { ox: 14, oy: -4, dx: 36, rot: 19 },
      ]
      const batch: CursorNote[] = arcOffsets.map((step) => {
        const id = ++noteIdRef.current
        const glyph = NOTE_GLYPHS[glyphIdxRef.current++ % NOTE_GLYPHS.length]
        return {
          id,
          x: x + step.ox,
          y: y + step.oy,
          dx: step.dx,
          rot: step.rot,
          glyph,
        }
      })
      pushNotes(batch)
    },
    [pushNotes, reduced],
  )

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduced || !finePointer || e.pointerType === 'touch') return

      const now = performance.now()
      if (now - lastSpawnTimeRef.current < TRAIL_THROTTLE_MS) return

      const prev = lastPosRef.current
      if (prev && Math.hypot(e.clientX - prev.x, e.clientY - prev.y) < TRAIL_MIN_DIST_PX) {
        return
      }

      lastSpawnTimeRef.current = now
      lastPosRef.current = { x: e.clientX, y: e.clientY }

      const id = ++noteIdRef.current
      const glyph = NOTE_GLYPHS[glyphIdxRef.current++ % NOTE_GLYPHS.length]
      const spread = (id % 5) - 2
      pushNotes([
        {
          id,
          x: e.clientX,
          y: e.clientY,
          dx: spread * 8,
          rot: spread * 6,
          glyph,
        },
      ])
    },
    [finePointer, pushNotes, reduced],
  )

  const playJazzMotif = useCallback((id: string) => {
    try {
      if (typeof window === 'undefined') return
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const AudioCtx = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext
        if (!AudioCtx) return
        audioCtxRef.current = new AudioCtx()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        void ctx
          .resume()
          .then(() => playMotifWithContext(ctx, id))
          .catch(() => {})
        return
      }
      playMotifWithContext(ctx, id)
    } catch {
      // Audio playback is optional enhancement; never interrupt interaction.
    }
  }, [])

  const handleInstrumentClick = useCallback(
    (id: string, e: ReactMouseEvent<HTMLButtonElement>) => {
      playJazzMotif(id)

      if (playingTimerRef.current !== null) {
        window.clearTimeout(playingTimerRef.current)
      }
      setPlayingId(id)
      playingTimerRef.current = window.setTimeout(() => {
        playingTimerRef.current = null
        setPlayingId(null)
      }, PLAYING_DURATION_MS)

      let burstX = e.clientX
      let burstY = e.clientY
      if (burstX === 0 && burstY === 0) {
        const rect = e.currentTarget.getBoundingClientRect()
        burstX = rect.left + rect.width / 2
        burstY = rect.top + rect.height / 2
      }
      spawnBurst(burstX, burstY)
    },
    [playJazzMotif, spawnBurst],
  )

  return (
    <div
      className={`page event-detail event-detail--festivalJazz jazz-page${reduced ? ' is-reduced' : ''}`}
      onPointerMove={handlePointerMove}
    >
      {!reduced && (
        <div className="jazz-cursor-layer" aria-hidden="true">
          {notes.map((n) => (
            <span
              key={n.id}
              className="jazz-cursor-note"
              style={
                {
                  left: n.x,
                  top: n.y,
                  '--dx': `${n.dx}px`,
                  '--rot': `${n.rot}deg`,
                } as CSSProperties
              }
            >
              {n.glyph}
            </span>
          ))}
        </div>
      )}

      <header className="jazz-hero">
        <img
          className="jazz-hero__img"
          src={mediaUrl(event.heroImage)}
          alt=""
          loading="eager"
          decoding="async"
        />
        <div className="jazz-hero__shade" aria-hidden="true" />
        <div className="jazz-hero__glow" aria-hidden="true" />
        <img
          className="jazz-hero__lantern"
          src={jazzArt('farol-colonial.webp')}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
        />
        <img
          className="jazz-hero__moon"
          src={jazzArt('luna-palma.webp')}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
        />
        <div className="jazz-hero__content">
          <p className="page-header__eyebrow">{labels.eventos.eyebrow}</p>
          <h1>{event.title}</h1>
          <p className="jazz-hero__tagline">{event.tagline}</p>
          <div className="jazz-hero__wave" aria-hidden="true">
            <svg viewBox="0 0 220 22" fill="none" focusable="false">
              <defs>
                <linearGradient id="jazz-hero-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e8b85c" stopOpacity="0" />
                  <stop offset="22%" stopColor="#e8b85c" stopOpacity="0.65" />
                  <stop offset="50%" stopColor="#f5d896" stopOpacity="0.95" />
                  <stop offset="78%" stopColor="#e8b85c" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#e8b85c" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 2 11 C 28 11, 38 11, 56 11 C 66 11, 70 4, 77 4 C 84 4, 88 18, 95 18 C 102 18, 105 2, 111 2 C 117 2, 121 20, 128 20 C 135 20, 139 5, 146 5 C 153 5, 157 14, 165 11 C 180 11, 194 11, 218 11"
                stroke="url(#jazz-hero-wave-grad)"
                strokeWidth="1.35"
                strokeLinecap="round"
              />
              <circle cx="111" cy="11" r="2.2" fill="#f5d896" opacity="0.85" />
            </svg>
          </div>
        </div>
      </header>

      <div className="jazz-ambient">
        <div className="jazz-sides" aria-hidden="true">
          <div className="jazz-sides__rail jazz-sides__rail--left">
            <img
              className="jazz-side-art jazz-side-art--balcon"
              src={jazzArt('balcon-colonial.webp')}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <img
              className="jazz-side-art jazz-side-art--cinta"
              src={jazzArt('cinta-musical.webp')}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <img
              className="jazz-side-art jazz-side-art--arco"
              src={jazzArt('arco-colonial.webp')}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="jazz-sides__rail jazz-sides__rail--right">
            <img
              className="jazz-side-art jazz-side-art--palma"
              src={jazzArt('palma-luces.webp')}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <img
              className="jazz-side-art jazz-side-art--saxofonista"
              src={jazzArt('saxofonista-farol.webp')}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <img
              className="jazz-side-art jazz-side-art--botanica"
              src={jazzArt('botanica-nocturna.webp')}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="jazz-ambient__inner">
          <section className="jazz-spread">
            <div className="jazz-spread__grid">
              {event.sections.map((section, index) => {
                const art = SPREAD_ART[index % SPREAD_ART.length]
                const variant = index === 0 || index === 3 ? 'wide' : 'tall'
                const num = String(index + 1).padStart(2, '0')

                return (
                  <Reveal
                    key={section.title}
                    delay={index * 0.06}
                    className={`jazz-card-wrap jazz-card-wrap--${index}`}
                  >
                    <article className={`jazz-card jazz-card--${variant} jazz-card--${index}`}>
                      <div className="jazz-card__copy">
                        <span className="jazz-card__index">{num}</span>
                        <h2>{section.title}</h2>
                        <p>{section.text}</p>
                      </div>
                      <div className="jazz-card__art" aria-hidden="true">
                        <img
                          className="jazz-card__img"
                          src={jazzArt(art.primary)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                        {art.secondary && (
                          <img
                            className="jazz-card__img jazz-card__img--secondary"
                            src={jazzArt(art.secondary)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </div>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          </section>

          {ensemble && (
            <section className="jazz-ensemble" aria-labelledby="jazz-ensemble-title">
              <Reveal className="jazz-ensemble__head">
                <p className="page-header__eyebrow">{ensemble.eyebrow}</p>
                <h2 id="jazz-ensemble-title">{ensemble.title}</h2>
                <p>{ensemble.lead}</p>
                <p className="jazz-ensemble__hint">
                  <span aria-hidden="true">♪</span> {ensemble.soundHint}
                </p>
              </Reveal>

              <Reveal delay={0.08} className="jazz-ensemble__grid">
                {ensemble.items.map((item) => {
                  const art = ENSEMBLE_ART[item.id] ?? { primary: 'notas-musicales.webp' }
                  const isPlaying = playingId === item.id

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`jazz-instrument${isPlaying ? ' is-playing' : ''}`}
                      onClick={(e) => handleInstrumentClick(item.id, e)}
                      aria-pressed={isPlaying}
                    >
                      <span className="jazz-instrument__stage" aria-hidden="true">
                        <img
                          className="jazz-instrument__art"
                          src={jazzArt(art.primary)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                        {art.secondary && (
                          <img
                            className="jazz-instrument__art-secondary"
                            src={jazzArt(art.secondary)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </span>
                      <span className="jazz-instrument__meta">
                        <span className="jazz-instrument__role">{item.role}</span>
                        <span className="jazz-instrument__bars" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </span>
                      </span>
                      <strong className="jazz-instrument__name">{item.name}</strong>
                      <span className="jazz-instrument__detail">{item.detail}</span>
                    </button>
                  )
                })}
              </Reveal>
            </section>
          )}
        </div>
      </div>

      <section className="jazz-program" aria-labelledby="jazz-program-title">
        <div className="jazz-program__garland" aria-hidden="true">
          <img
            src={jazzArt('guirnalda-luces.webp')}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <img
            className="jazz-program__garland-mirror"
            src={jazzArt('guirnalda-luces.webp')}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="jazz-program__inner">
          <Reveal>
            <div className="jazz-program__origin">
              <p className="page-header__eyebrow">{event.origenTitle}</p>
              <h2 id="jazz-program-title">{event.escenariosTitle}</h2>
              <p>{event.origenText}</p>
            </div>
          </Reveal>

          <div className="jazz-program__grid">
            {event.escenarios.map((stage, i) => (
              <Reveal key={stage} delay={i * 0.08}>
                <article className="jazz-stage-card">
                  <span className="jazz-stage-card__roman" aria-hidden="true">
                    {ROMAN[i] ?? String(i + 1)}
                  </span>
                  <h3>{stage}</h3>
                  <p>{event.escenariosStub}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="jazz-pass-band">
        <img
          className="jazz-pass-flank jazz-pass-flank--left"
          src={jazzArt('palma-luces.webp')}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
        <img
          className="jazz-pass-flank jazz-pass-flank--right"
          src={jazzArt('cinta-musical.webp')}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
        <Reveal>
          <aside className="jazz-pass" aria-labelledby="jazz-pass-title">
            <div className="jazz-pass__stub">
              <p className="page-header__eyebrow">Mompox · Bolívar</p>
              <h2 id="jazz-pass-title">{event.consejosTitle}</h2>
              <img
                className="jazz-pass__ornament"
                src={jazzArt('notas-musicales.webp')}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="jazz-pass__body">
              <ul>
                {event.consejos.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
              <Link to="/contacto" className="btn btn--primary">
                {event.consulta} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  )
}
