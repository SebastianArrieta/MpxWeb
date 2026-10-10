import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useApp, type Audience } from '../context/AppContext'
import mompoxHero from '../../assets/Mompox.jpeg'

const SLIDE_MS = 5200
const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Presentación previa al sitio: diapositivas automáticas (con opción de avanzar
 * o saltar) que terminan en la elección de perfil Visitante / Momposino.
 */
export default function EntryGate() {
  const { setAudience, labels } = useApp()
  const slides = labels.presentacion.slides
  const total = slides.length
  const [step, setStep] = useState(0)
  const onChoice = step >= total

  useEffect(() => {
    if (onChoice) return
    const timer = window.setTimeout(() => setStep((s) => s + 1), SLIDE_MS)
    return () => window.clearTimeout(timer)
  }, [step, onChoice])

  const choose = (a: Audience) => setAudience(a)

  return (
    <MotionConfig reducedMotion="user">
    <div className="intro">
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
              <h1 className="intro__title">{slides[step].title}</h1>
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
              <h1 className="intro__title">{labels.entrada.pregunta}</h1>
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
