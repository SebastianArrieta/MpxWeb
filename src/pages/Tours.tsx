import { useApp } from '../context/AppContext'

export default function Tours() {
  const { labels } = useApp()
  const l = labels.tours
  return (
    <div className="page">
      <header className="page-header">
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
      </header>

      <section className="section">
        <h2 className="section__title">{l.presenciales}</h2>
        <div className="card-grid card-grid--3">
          {l.presencialesList.map((t) => (
            <article key={t.title} className="info-card">
              <span className="info-card__tag">{l.presencialTag}</span>
              <h3>{t.title}</h3>
              <p>{t.meta}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">{l.virtuales}</h2>
        <div className="card-grid card-grid--3">
          {l.virtualesList.map((t) => (
            <article key={t.title} className="info-card info-card--teal">
              <span className="info-card__tag">{l.virtualTag}</span>
              <h3>{t.title}</h3>
              <p>{t.meta}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}