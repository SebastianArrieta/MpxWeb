import { useApp } from '../context/AppContext'
import Gallery from '../components/Gallery'

export default function SemanaSanta() {
  const { labels } = useApp()
  const l = labels.semanaSanta
  return (
    <div className="page">
      <header className="page-header">
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
      </header>

      <section className="section">
        <h2 className="section__title">{l.historiaTitle}</h2>
        <p className="placeholder-text">{l.historiaText}</p>
      </section>

      <section className="section">
        <h2 className="section__title">{l.procesionesTitle}</h2>
        <ul className="stub-list">
          {l.procesiones.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2 className="section__title">{l.galeriaTitle}</h2>
        <Gallery items={l.galeria ?? []} label={l.galeriaTitle} />
      </section>
    </div>
  )
}