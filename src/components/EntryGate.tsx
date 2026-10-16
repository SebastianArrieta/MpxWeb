import { useEffect, useRef, useState, type FocusEvent } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useApp, type Audience } from '../context/AppContext'
import mompoxHero from '../../assets/Mompox.jpeg'

const SLIDE_MS = 5200
const EASE = [0.22, 1, 0.36, 1] as const

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Presentación previa al sitio: diapositivas automáticas (con opción de pausar,
 * avanzar o saltar) que terminan en la elección de perfil Visitante / Momposino.
 * El avance automático se detiene con foco, hover o prefers-reduced-motion.
 */
export default function EntryGate() {
  const { setAudience, labels } = useApp()
  const slides = labels.presentacion.slides
  const total = slides.length
  const reduced = useRef(prefersReducedMotion()).current
  const [step, setStep] = useState(0)
  const [userPaused, setUserPaused] = useState(reduced)
  const [interacting, setInteracting] = useState(false)
  const onChoice = step >= total
  const paused = userPaused || interacting

  useEffect(() => {
    if (onChoice || paused) return
    const timer = window.setTimeout(() => setStep((s) => s + 1), SLIDE_MS)
    return () => window.clearTimeout(timer)
  }, [step, onChoice, paused])

  const onFocusCapture = () => setInteracting(true)
  const onBlurCapture = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setInteracting(false)
  }

  const choose = (a: Audience) => setAudience(a)

  return (
    <MotionConfig reducedMotion="user">
    <div
      className="intro"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
    >
      <div className="intro__bg" aria-hidden="true">
        <img src={mompoxHero} alt="" />
      </div>
      <div className="intro__shade" aria-hidden="true" />

      <div className="intro__body">
        <AnimatePresence mode="wait">
          {!onChoice ? (
            <motion.div
              key={`slide-${step}`}
              className="intro__slide"
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <p className="intro__eyebrow">{slides[step].eyebrow}</p>
              <h2 className="intro__title" id="intro-title">{slides[step].title}</h2>
              <p className="intro__text">{slides[step].text}</p>
            </motion.div>
          ) : (
            <motion.div
              key="choice"
              className="intro__slide"
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <p className="intro__eyebrow">{labels.entrada.eyebrow}</p>
              <h2 className="intro__title" id="intro-title">{labels.entrada.pregunta}</h2>
              <p className="intro__text">{labels.entrada.ayuda}</p>
              <div className="intro__actions">
                <button type="button" className="btn btn--primary" onClick={() => choose('visitante')}>
                  {labels.entrada.opcionVisitante}
                </button>
                <button type="button" className="btn btn--secondary" onClick={() => choose('momposino')}>
                  {labels.entrada.opcionMomposino}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="intro__footer">
          <div className="intro__dots" aria-hidden="true">
            {Array.from({ length: total + 1 }, (_, i) => (
              <span key={i} className={i === step ? 'is-on' : ''} />
            ))}
          </div>
          {!onChoice ? (
            <div className="intro__controls">
              <button
                type="button"
                className="intro__pause"
                aria-label={userPaused ? labels.presentacion.reproducir : labels.presentacion.pausar}
                aria-pressed={userPaused}
                onClick={() => setUserPaused((p) => !p)}
              >
                <span className={userPaused ? 'is-play' : 'is-pause'} aria-hidden="true" />
              </button>
              <button type="button" className="intro__skip" onClick={() => setStep(total)}>
                {labels.presentacion.saltar}
              </button>
              <button type="button" className="btn btn--primary" onClick={() => setStep((s) => s + 1)}>
                {labels.presentacion.continuar}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
    </MotionConfig>
  )
}
