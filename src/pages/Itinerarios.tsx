import { Link } from '../components/LocaleLink'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'

export default function Itinerarios() {
  const { labels } = useApp()
  const l = labels.itinerariosPagina
  return (
    <div className="page">
      <header className="page-header">
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
      </header>
      {l.rutas.map((ruta, i) => (
        <Reveal key={ruta.titulo} delay={i * 0.06}>
          <section className="section itinerario">
            <header className="itinerario__head">
              <h2 className="section__title">{ruta.titulo}</h2>
              <p className="itinerario__dur">{ruta.duracion}</p>
            </header>
            <ol className="itinerario__steps">
              {ruta.paradas.map((p) => (
                <li key={p.nombre}>
                  <strong>{p.nombre}</strong>
                  <span>{p.nota}</span>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>
      ))}
      <Link to="/mapa" className="btn btn--primary itinerarios-map-link">
        {l.ctaMapa} ↗
      </Link>
    </div>
  )
}
