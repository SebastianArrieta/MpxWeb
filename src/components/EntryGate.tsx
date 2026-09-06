import { useApp, type Audience } from '../context/AppContext'

export default function EntryGate() {
  const { setAudience, labels } = useApp()

  const choose = (a: Audience) => setAudience(a)

  return (
    <div className="entry-gate">
      <div className="entry-gate__card">
        <p className="entry-gate__eyebrow">{labels.entrada.eyebrow}</p>
        <h1 className="entry-gate__title">{labels.entrada.pregunta}</h1>
        <p className="entry-gate__hint">{labels.entrada.ayuda}</p>
        <div className="entry-gate__actions">
          <button type="button" className="btn btn--primary" onClick={() => choose('visitante')}>
            {labels.entrada.opcionVisitante}
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => choose('momposino')}>
            {labels.entrada.opcionMomposino}
          </button>
        </div>
      </div>
    </div>
  )
}