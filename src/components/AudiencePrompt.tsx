import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useApp, type Audience } from '../context/AppContext'

const DISMISS_KEY = 'mpx-audience-prompt'

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === 'dismissed'
  } catch {
    return false
  }
}

/**
 * Selector editorial compacto Visitante / Momposino dentro del inicio.
 * Si se ignora o se cierra, el inicio usa el orden de visitante.
 * La elección se puede cambiar luego desde el pie de página.
 */
export default function AudiencePrompt() {
  const { audience, setAudience, labels } = useApp()
  const [dismissed, setDismissed] = useState(wasDismissed)
  const l = labels.entrada
  const visible = audience === null && !dismissed

  const choose = (value: Audience) => setAudience(value)
  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, 'dismissed')
    } catch {
      /* almacenamiento no disponible: se cierra solo en esta visita */
    }
    setDismissed(true)
  }

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.section
          className="audience-bar"
          aria-labelledby="audience-prompt-title"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="audience-bar__wrap">
            <div className="audience-bar__inner">
              <div className="audience-bar__label">
                <span className="audience-bar__dot" aria-hidden="true" />
                <p id="audience-prompt-title" className="audience-bar__question">
                  {l.pregunta}
                </p>
              </div>

              <div className="audience-bar__controls">
                <div
                  className="audience-bar__toggle"
                  role="group"
                  aria-labelledby="audience-prompt-title"
                >
                  <button
                    type="button"
                    className={`audience-bar__option${audience === 'visitante' ? ' is-active' : ''}`}
                    aria-pressed={audience === 'visitante'}
                    onClick={() => choose('visitante')}
                  >
                    {l.opcionVisitante}
                  </button>
                  <button
                    type="button"
                    className={`audience-bar__option${audience === 'momposino' ? ' is-active' : ''}`}
                    aria-pressed={audience === 'momposino'}
                    onClick={() => choose('momposino')}
                  >
                    {l.opcionMomposino}
                  </button>
                </div>

                <button
                  type="button"
                  className="audience-bar__close"
                  aria-label={l.cerrar}
                  title={l.cerrar}
                  onClick={dismiss}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  )
}
