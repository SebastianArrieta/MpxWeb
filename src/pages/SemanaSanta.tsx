import { useApp } from '../context/AppContext'

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
        <div className="gallery-stub">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="gallery-stub__item">
              {l.galeriaFoto.replace('{n}', String(n))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}