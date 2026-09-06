import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import VisitCounter from '../components/VisitCounter'
import Timeline from '../components/Timeline'
import { mediaUrl } from '../helpers/mediaUrl'

export default function Home() {
  const { audience, labels } = useApp()
  const isLocal = audience === 'momposino'
  const quick = isLocal ? labels.inicio.quickMomposino : labels.inicio.quickVisitante
  const perfil = isLocal ? labels.audiencia.chipMomposino : labels.audiencia.chipVisitante
  const helper = isLocal ? labels.inicio.msgMomposino : labels.inicio.msgVisitante

  return (
    <div className="page home">
      <section className="hero hero--cinematic">
        <div className="hero__backdrop">
          <img src={mediaUrl('media/images/muestra-mompox.svg')} alt="" />
        </div>
        <div className="hero__shade" aria-hidden="true" />
        <p className="hero__eyebrow">{labels.inicio.eyebrow}</p>
        <h1 className="hero__title">{labels.site.fullName}</h1>
        <p className="hero__slogan">{labels.site.slogan}</p>
        <p className="hero__helper">{helper}</p>
        <div className="hero__actions">
          <Link to="/historia" className="btn btn--primary">
            {labels.inicio.ctaHistoria}
          </Link>
          <Link to="/mapa" className="btn btn--ghost">
            {labels.inicio.ctaMapa}
          </Link>
        </div>
        <div className="badge-row" aria-label="Reconocimientos">
          {labels.inicio.reconocimientos.map((b, i) => (
            <span key={b} className="badge" style={{ ['--i' as string]: i }}>
              {b}
            </span>
          ))}
        </div>
        <div className="hero__meta">
          <VisitCounter />
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">{labels.inicio.accesosTitle}</h2>
        <p className="section__lead">{labels.inicio.accesosLead.replace('{perfil}', perfil)}</p>
        <div className="quick-grid">
          {quick.map((item) => (
            <Link key={item.to} to={item.to} className="quick-card">
              <span className="quick-card__label">{item.label}</span>
              <span className="quick-card__hint">{item.hint}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--band">
        <div className="historia-teaser">
          <div>
            <h2 className="section__title">{labels.inicio.historiaTeaserTitle}</h2>
            <p className="section__lead">{labels.inicio.historiaTeaserLead}</p>
            <Link to="/historia" className="btn btn--primary">
              {labels.inicio.historiaTeaserCta}
            </Link>
          </div>
          <Timeline preview />
        </div>
      </section>
    </div>
  )
}