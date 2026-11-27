import { Link } from '../components/LocaleLink'
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
      <section className="section travel-operators">
        <header className="section__head">
          <div>
            <h2 className="section__title">{l.empresasTitle}</h2>
            <p className="section__lead">{l.empresasLead}</p>
          </div>
        </header>
        <div className="card-grid card-grid--3">
          {l.empresas.map((empresa) => (
            <article className="info-card info-card--teal" key={empresa.nombre}>
              <span className="info-card__tag">{empresa.tipo}</span>
              <h3>{empresa.nombre}</h3>
              <p>{empresa.detalle}</p>
              <a className="info-card__cta" href={empresa.web} target="_blank" rel="noreferrer">
                {empresa.webLabel} ↗
              </a>
            </article>
          ))}
        </div>
      </section>
      <p className="travel-note">{l.nota}</p>
      <p className="travel-guide-link">
        <Link to="/guia-practica">{l.ctaGuia} →</Link>
      </p>
      <Link to="/mapa" className="btn btn--primary itinerarios-map-link">
        {l.ctaMapa} ↗
      </Link>
    </div>
  )
}
