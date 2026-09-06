import { useApp, type Audience } from '../context/AppContext'

export default function EntryGate() {
  const { setAudience } = useApp()

  const choose = (a: Audience) => setAudience(a)

  return (
    <div className="entry-gate">
      <div className="entry-gate__card">
        <p className="entry-gate__eyebrow">Santa Cruz de Mompox</p>
        <h1 className="entry-gate__title">¿Eres visitante o momposino?</h1>
        <p className="entry-gate__hint">
          Tu elección ordena el inicio y muestra mensajes breves. Puedes cambiarla
          cuando quieras desde la barra superior.
        </p>
        <div className="entry-gate__actions">
          <button type="button" className="btn btn--primary" onClick={() => choose('visitante')}>
            Visitante
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => choose('momposino')}>
            Momposino
          </button>
        </div>
      </div>
    </div>
  )
}
