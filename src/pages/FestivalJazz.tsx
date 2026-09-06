import { useApp } from '../context/AppContext'

export default function FestivalJazz() {
  const { labels } = useApp()
  const l = labels.festivalJazz
  return (
    <div className="page">
      <header className="page-header">
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
      </header>

      <section className="section">
        <h2 className="section__title">{l.origenTitle}</h2>
        <p className="placeholder-text">{l.origenText}</p>
      </section>

      <section className="section">
        <h2 className="section__title">{l.escenariosTitle}</h2>
        <div className="card-grid card-grid--3">
          {l.escenarios.map((name) => (
            <article key={name} className="info-card">
              <h3>{name}</h3>
              <p>{l.escenariosStub}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">{l.galeriaTitle}</h2>
        <div className="gallery-stub">
          {[1, 2, 3].map((n) => (
            <div key={n} className="gallery-stub__item">
              {l.galeriaConcierto.replace('{n}', String(n))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}