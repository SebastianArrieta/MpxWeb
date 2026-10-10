import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'

export default function ComoLlegar() {
  const { labels } = useApp()
  const l = labels.comoLlegarPagina
  return (
    <div className="page">
      <header className="page-header">
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
      </header>
      <div className="card-grid card-grid--2">
        {l.secciones.map((s, i) => (
          <Reveal key={s.title} delay={(i % 2) * 0.1}>
            <article className="info-card info-card--accent">
              <h2 className="info-card__title">{s.title}</h2>
              <ul className="stub-list">
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="travel-note">{l.nota}</p>
      <Link to="/mapa" className="btn btn--primary itinerarios-map-link">
        {l.ctaMapa} ↗
      </Link>
    </div>
  )
}
