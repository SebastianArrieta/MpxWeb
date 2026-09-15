import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Gallery from '../components/Gallery'

export default function Eventos() {
  const { labels } = useApp()
  const { hash } = useLocation()
  const e = labels.eventos
  const santa = labels.semanaSanta
  const jazz = labels.festivalJazz
  const current =
    hash === '#festijazz' ? 'festijazz' : hash === '#semana-santa' ? 'semana-santa' : ''

  return (
    <div className="page eventos">
      <header className="page-header">
        <p className="page-header__eyebrow">{e.eyebrow}</p>
        <h1>{e.title}</h1>
        <p>{e.tagline}</p>
      </header>

      <nav className="eventos-jump" aria-label={e.jumpAria}>
        <Link
          to="/eventos#semana-santa"
          className={current === 'semana-santa' ? 'is-active' : ''}
          aria-current={current === 'semana-santa' ? 'location' : undefined}
        >
          {e.semanaSanta}
        </Link>
        <Link
          to="/eventos#festijazz"
          className={current === 'festijazz' ? 'is-active' : ''}
          aria-current={current === 'festijazz' ? 'location' : undefined}
        >
          {e.festijazz}
        </Link>
      </nav>

      <article id="semana-santa" className="festival-block">
        <header className="festival-block__header">
          <h2 className="festival-block__title">{santa.title}</h2>
          <p>{santa.tagline}</p>
        </header>

        <section className="section">
          <h3 className="section__title">{santa.historiaTitle}</h3>
          <p className="placeholder-text">{santa.historiaText}</p>
        </section>

        <section className="section">
          <h3 className="section__title">{santa.procesionesTitle}</h3>
          <ul className="stub-list">
            {santa.procesiones.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h3 className="section__title">{santa.galeriaTitle}</h3>
          <Gallery items={santa.galeria ?? []} label={santa.galeriaTitle} />
        </section>
      </article>

      <article id="festijazz" className="festival-block">
        <header className="festival-block__header">
          <h2 className="festival-block__title">{jazz.title}</h2>
          <p>{jazz.tagline}</p>
        </header>

        <section className="section">
          <h3 className="section__title">{jazz.origenTitle}</h3>
          <p className="placeholder-text">{jazz.origenText}</p>
        </section>

        <section className="section">
          <h3 className="section__title">{jazz.escenariosTitle}</h3>
          <div className="card-grid card-grid--3">
            {jazz.escenarios.map((name) => (
              <article key={name} className="info-card">
                <h3>{name}</h3>
                <p>{jazz.escenariosStub}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h3 className="section__title">{jazz.galeriaTitle}</h3>
          <Gallery items={jazz.galeria ?? []} label={jazz.galeriaTitle} />
        </section>
      </article>
    </div>
  )
}
