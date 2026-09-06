import { useApp } from '../context/AppContext'

export default function QueVer() {
  const { labels } = useApp()
  return (
    <div className="page">
      <header className="page-header">
        <h1>{labels.queVer.title}</h1>
        <p>{labels.queVer.tagline}</p>
      </header>

      <section className="section">
        <div className="card-grid card-grid--2">
          {labels.queVer.sights.map((s) => (
            <article key={s.title} className="info-card info-card--accent">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}