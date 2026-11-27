import { Link } from '../components/LocaleLink'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'
import { mediaUrl } from '../helpers/mediaUrl'

export default function EventoDetalle({ tipo }: { tipo: 'semanaSanta' | 'festivalJazz' }) {
  const { labels } = useApp()
  const event = labels[tipo]

  return (
    <div className={`page event-detail event-detail--${tipo}`}>
      <header className="event-detail__hero">
        <img src={mediaUrl(event.heroImage)} alt="" />
        <div className="event-detail__shade" />
        <div className="event-detail__heading">
          <p className="page-header__eyebrow">{labels.eventos.eyebrow}</p>
          <h1>{event.title}</h1>
          <p>{event.tagline}</p>
        </div>
      </header>

      <div className="event-detail__sections">
        {event.sections.map((section, index) => (
          <Reveal key={section.title} delay={index * 0.06}>
            <section className="event-detail__section">
              <span className="event-detail__index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <aside className="event-detail__tips">
          <div>
            <p className="page-header__eyebrow">Mompox · Bolívar</p>
            <h2>{event.consejosTitle}</h2>
          </div>
          <ul>
            {event.consejos.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
          <Link to="/contacto" className="btn btn--primary">
            {event.consulta} <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </Reveal>
    </div>
  )
}
