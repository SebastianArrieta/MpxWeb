import Timeline from '../components/Timeline'
import Simbolos from '../components/Simbolos'
import { useApp } from '../context/AppContext'

export default function Historia() {
  const { labels } = useApp()
  return (
    <div className="page page--historia">
      <header className="historia-hero">
        <p className="page-header__eyebrow">{labels.historia.eyebrow}</p>
        <h1>{labels.historia.title}</h1>
        <p>{labels.historia.intro}</p>
        <div className="historia-hero__hint" aria-hidden="true">
          <span>{labels.historia.desplaza}</span>
          <span className="historia-hero__arrow">↓</span>
        </div>
      </header>

      <Simbolos />

      <section className="section section--timeline" aria-label={labels.timelineUi.railAria}>
        <Timeline />
      </section>
    </div>
  )
}