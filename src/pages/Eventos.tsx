import { Link } from '../components/LocaleLink'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'
import { mediaUrl } from '../helpers/mediaUrl'

export default function Eventos() {
  const { labels } = useApp()
  const items = [
    { to: '/semana-santa', data: labels.semanaSanta },
    { to: '/festival-jazz', data: labels.festivalJazz },
  ]

  return (
    <div className="page">
      <header className="page-header">
        <p className="page-header__eyebrow">{labels.eventos.eyebrow}</p>
        <h1>{labels.eventos.title}</h1>
        <p>{labels.eventos.tagline}</p>
      </header>
      <div className="home__start-grid event-overview-grid">
        {items.map(({ to, data }, index) => (
          <Reveal key={to} delay={index * 0.1}>
            <Link to={to} className="start-card">
              <span className="start-card__image">
                <img src={mediaUrl(data.heroImage)} alt="" loading="lazy" />
              </span>
              <span className="start-card__copy">
                <strong>{data.title}</strong>
                <span>{data.tagline}</span>
                <span className="start-card__more">{labels.comunes.explorar} ↗</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
