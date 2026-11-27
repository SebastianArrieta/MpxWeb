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
        <div className="historia-hero__wave" aria-hidden="true">
          <svg viewBox="0 0 280 22" fill="none" preserveAspectRatio="none" focusable="false">
            <path
              d="M0 11 Q 35 2, 70 11 T 140 11 T 210 11 T 280 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M24 17 Q 62 10, 100 17 T 176 17 T 256 17"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <div className="historia-hero__hint" aria-hidden="true">
          <span>{labels.historia.desplaza}</span>
          <span className="historia-hero__arrow">↓</span>
        </div>
      </header>

      <Simbolos />

      <section className="section section--timeline section--timeline-rio" aria-label={labels.timelineUi.railAria}>
        <Timeline />
      </section>
    </div>
  )
}