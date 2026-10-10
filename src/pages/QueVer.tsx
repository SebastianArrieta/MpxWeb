import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'
import { mediaUrl } from '../helpers/mediaUrl'

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
          {labels.queVer.sights.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.1}>
              <article className="info-card info-card--accent sight-card">
                <img src={mediaUrl(s.image)} alt="" loading="lazy" decoding="async" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
