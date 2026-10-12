import { useApp } from '../context/AppContext'
import { mediaUrl } from '../helpers/mediaUrl'

export default function Simbolos() {
  const { labels } = useApp()
  const { bandera, escudo, himno, datos, datosTitle } = labels.simbolos

  return (
    <section className="simbolos section" aria-label={labels.historia.simbolosTitle}>
      <header className="simbolos__head">
        <p className="section__eyebrow">{labels.historia.simbolosEyebrow}</p>
        <h2>{labels.historia.simbolosTitle}</h2>
        <p>{labels.historia.simbolosIntro}</p>
      </header>

      <div className="simbolos__grid">
        <article className="simbolo-card">
          <div className="simbolo-card__media simbolo-card__media--flag">
            <img src={mediaUrl(bandera.image)} alt={bandera.alt} loading="lazy" decoding="async" />
          </div>
          <div className="simbolo-card__copy">
            <h3>{bandera.title}</h3>
            <p>{bandera.description}</p>
          </div>
        </article>

        <article className="simbolo-card">
          <div className="simbolo-card__media simbolo-card__media--shield">
            <img src={mediaUrl(escudo.image)} alt={escudo.alt} loading="lazy" decoding="async" />
          </div>
          <div className="simbolo-card__copy">
            <h3>{escudo.title}</h3>
            <p>{escudo.description}</p>
          </div>
        </article>

        <article className="simbolo-card simbolo-card--anthem">
          <div className="simbolo-card__copy">
            <h3>{himno.title}</h3>
            <p className="simbolo-card__author">
              {labels.comunes.autor}: {himno.author}
            </p>
            <p className="simbolo-card__note">{himno.note}</p>
            <blockquote className="simbolo-anthem">
              <p className="simbolo-anthem__coroTitle">{himno.coroTitle}</p>
              <p className="simbolo-anthem__coro">{himno.coro}</p>
              <ol className="simbolo-anthem__estrofas">
                {himno.estrofas.map((estrofa, i) => (
                  <li key={i}>
                    <span className="simbolo-anthem__num">{String.fromCharCode(9312 + i)}</span>
                    <p>{estrofa}</p>
                  </li>
                ))}
              </ol>
            </blockquote>
          </div>
        </article>
      </div>

      <div className="datos-generales">
        <h3>{datosTitle}</h3>
        <dl className="datos-generales__list">
          {datos.map((item) => (
            <div key={item.label} className="datos-generales__item">
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <footer className="simbolos__creditos">
        <h4>{labels.historia.creditos}</h4>
        <ul>
          <li>{bandera.credit}</li>
          <li>{escudo.credit}</li>
          <li>{labels.simbolos.imagenesCredit}</li>
        </ul>
      </footer>
    </section>
  )
}