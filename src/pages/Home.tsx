import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import VisitCounter from '../components/VisitCounter'
import Timeline from '../components/Timeline'
import mompoxHero from '../../assets/Mompox.jpeg'

export default function Home() {
  const { audience, labels } = useApp()
  const isLocal = audience === 'momposino'
  const quick = isLocal ? labels.inicio.quickMomposino : labels.inicio.quickVisitante
  const helper = isLocal ? labels.inicio.msgMomposino : labels.inicio.msgVisitante
  const events = labels.eventos
  const santa = labels.semanaSanta
  const jazz = labels.festivalJazz

  return (
    <div className="page home">
      <section className="hero hero--cinematic">
        <div className="hero__backdrop">
          <img src={mompoxHero} alt={labels.site.fullName} />
        </div>
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__overlay">
          <p className="hero__eyebrow">{labels.inicio.eyebrow}</p>
          <h1 className="hero__title">{labels.site.fullName}</h1>
          <p className="hero__slogan">{labels.site.slogan}</p>
          <div className="hero__actions">
            <Link to="/historia" className="btn btn--primary">
              {labels.inicio.ctaHistoria}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link to="/mapa" className="btn btn--ghost">
              {labels.inicio.ctaMapa}
            </Link>
          </div>
        </div>
      </section>

      <section className="home__band">
        <div className="home__section home__intro">
          <p className="page-header__eyebrow">{labels.inicio.eyebrow}</p>
          <h2 className="home__intro-title">{labels.inicio.introTitle}</h2>
          <p className="home__intro-lead">{labels.inicio.introLead}</p>
          <p className="home__intro-helper">{helper}</p>
          <div className="badge-row" aria-label="Reconocimientos">
            {labels.inicio.reconocimientos.map((b) => (
              <span key={b} className="badge">
                {b}
              </span>
            ))}
          </div>
          <div className="home__intro-meta">
            <VisitCounter />
          </div>
        </div>
      </section>

      <section className="section home__section">
        <h2 className="section__title">{labels.inicio.accesosTitle}</h2>
        <p className="section__lead">{labels.inicio.accesosLead}</p>
        <div className="quick-grid">
          {quick.map((item) => (
            <Link key={item.to} to={item.to} className="quick-card">
              <span className="quick-card__label">{item.label}</span>
              <span className="quick-card__hint">{item.hint}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section home__section">
        <h2 className="section__title">{labels.inicio.eventsTitle}</h2>
        <p className="section__lead">{labels.inicio.eventsLead}</p>
        <div className="home__event-grid">
          <Link to="/eventos#semana-santa" className="home__event-card">
            <p className="page-header__eyebrow">{events.semanaSanta}</p>
            <h3>{santa.title}</h3>
            <p>{santa.tagline}</p>
            <span className="home__event-cta">
              {labels.inicio.ctaEventos}
              <span aria-hidden="true"> →</span>
            </span>
          </Link>
          <Link to="/eventos#festijazz" className="home__event-card">
            <p className="page-header__eyebrow">{events.festijazz}</p>
            <h3>{jazz.title}</h3>
            <p>{jazz.tagline}</p>
            <span className="home__event-cta">
              {labels.inicio.ctaEventos}
              <span aria-hidden="true"> →</span>
            </span>
          </Link>
        </div>
      </section>

      <section className="section home__section home__historia">
        <div className="historia-teaser">
          <div>
            <h2 className="section__title">{labels.inicio.historiaTeaserTitle}</h2>
            <p className="section__lead">{labels.inicio.historiaTeaserLead}</p>
            <Link to="/historia" className="btn btn--primary">
              {labels.inicio.historiaTeaserCta}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
          <Timeline preview />
        </div>
      </section>
    </div>
  )
}