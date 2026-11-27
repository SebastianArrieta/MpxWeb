import { Link } from '../components/LocaleLink'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'

export default function GuiaPractica() {
  const { labels } = useApp()
  const l = labels.guiaPractica

  return (
    <div className="page page--guia">
      <header className="page-header">
        <p className="page-header__eyebrow">{l.eyebrow}</p>
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
        <p className="guia__updated">{l.actualizado}</p>
      </header>

      <nav className="guia__index" aria-label={l.indiceAria}>
        {l.secciones.map((s) => (
          <a key={s.id} href={`#${s.id}`}>{s.title}</a>
        ))}
        <a href="#faq">{l.faqTitle}</a>
      </nav>

      <div className="guia__sections">
        {l.secciones.map((s, i) => (
          <Reveal key={s.id} delay={(i % 2) * 0.06}>
            <section className="info-card guia__section" id={s.id} aria-labelledby={`${s.id}-title`}>
              <h2 className="info-card__title" id={`${s.id}-title`}>{s.title}</h2>
              <ul>
                {s.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>

      <section className="section guia__faq" id="faq" aria-labelledby="faq-title">
        <h2 className="section__title" id="faq-title">{l.faqTitle}</h2>
        {l.faq.map((item) => (
          <details key={item.q} className="guia__faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <Link to="/mapa" className="btn btn--primary itinerarios-map-link">
        {l.cta} <span aria-hidden="true">→</span>
      </Link>

      <section className="guia__sources" aria-labelledby="fuentes-title">
        <h2 id="fuentes-title">{l.fuentesTitle}</h2>
        <p>{l.fuentesNota}</p>
        <ul>
          {l.fuentes.map((f) => (
            <li key={f.url}>
              <a href={f.url} target="_blank" rel="noreferrer">{f.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
