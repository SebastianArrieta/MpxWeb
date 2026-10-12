import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'

export default function Tours() {
  const { labels } = useApp()
  const l = labels.tours
  const juan = labels.authors.find((author) => author.id === 'juan') ?? labels.authors[0]
  const valerosa = l.valerosa

  const renderTours = (items: typeof l.presencialesList, tag: string, tone = '') => (
    <div className="card-grid card-grid--3 tour-grid">
      {items.map((tour, i) => (
        <Reveal key={tour.title} delay={(i % 3) * 0.07}>
          <article className={`info-card tour-card ${tone}`}>
            <span className="info-card__tag">{tag}</span>
            <h3>{tour.title}</h3>
            <p className="tour-card__meta">{tour.meta}</p>
            <p>{tour.detalle}</p>
            <a className="info-card__cta" href={juan.instagramUrl} target="_blank" rel="noreferrer">
              {l.consulta} ↗
            </a>
          </article>
        </Reveal>
      ))}
    </div>
  )

  return (
    <div className="page page--tours">
      <header className="page-header">
        <p className="page-header__eyebrow">Mompox · Experiencias locales</p>
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
      </header>

      <section className="section tours-recommended" aria-labelledby="valerosa-title">
        <header className="section__head">
          <div>
            <span className="page-header__eyebrow">{valerosa.tag}</span>
            <h2 className="section__title" id="valerosa-title">{valerosa.title}</h2>
            <p className="section__lead">{valerosa.lead}</p>
          </div>
        </header>
        <div className="card-grid card-grid--2">
          {valerosa.items.map((tour) => (
            <article className="info-card tour-card tour-card--recommended" key={tour.title}>
              <span className="info-card__tag">{valerosa.recommended}</span>
              <h3>{tour.title}</h3>
              <p className="tour-card__meta">{valerosa.departure}: {tour.departure}</p>
              <p>{tour.detail}</p>
            </article>
          ))}
        </div>
        <div className="tour-recommended__contact">
          <p><strong>{valerosa.contactLabel}:</strong> {valerosa.phone}</p>
          <a className="info-card__cta" href={valerosa.instagram} target="_blank" rel="noreferrer">
            {valerosa.instagramLabel} ↗
          </a>
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">{l.presenciales}</h2>
        {renderTours(l.presencialesList, l.presencialTag)}
      </section>

      <section className="section">
        <h2 className="section__title">{l.virtuales}</h2>
        {renderTours(l.virtualesList, l.virtualTag, 'info-card--teal')}
      </section>

      <section className="section tour-services">
        <h2 className="section__title">{l.serviciosTitle}</h2>
        <ul className="stub-list">
          {l.servicios.map((service) => <li key={service}>{service}</li>)}
        </ul>
        <p className="tour-services__links">
          <Link to="/mapa">{labels.mapa.title} ↗</Link>
          <Link to="/como-llegar">{labels.comoLlegarPagina.title} ↗</Link>
        </p>
      </section>
    </div>
  )
}
