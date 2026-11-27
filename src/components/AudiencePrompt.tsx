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
 * Pregunta Visitante / Momposino sin bloquear el sitio: es una tarjeta dentro
 * del inicio. Si se ignora o se cierra, el inicio usa el orden de visitante.
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
          className="audience-prompt"
          aria-labelledby="audience-prompt-title"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="audience-prompt__card">
            <div className="audience-prompt__copy">
              <h2 id="audience-prompt-title">{l.pregunta}</h2>
              <p>{l.ayuda}</p>
            </div>
            <div className="audience-prompt__actions">
              <button type="button" className="btn btn--primary" onClick={() => choose('visitante')}>
                {l.opcionVisitante}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => choose('momposino')}>
                {l.opcionMomposino}
              </button>
            </div>
            <button
              type="button"
              className="audience-prompt__close"
              aria-label={l.cerrar}
              title={l.cerrar}
              onClick={dismiss}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  )
}
