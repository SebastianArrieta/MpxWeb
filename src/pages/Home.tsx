import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import VisitCounter from '../components/VisitCounter'
import Timeline from '../components/Timeline'

const BADGES = ['UNESCO 1995', 'Monumento Nacional 1959']

const QUICK_VISITANTE = [
  { to: '/mapa', label: 'Explorar mapa', hint: 'Calles y puntos de interés' },
  { to: '/historia', label: 'Historia', hint: 'Línea de tiempo interactiva' },
  { to: '/semana-santa', label: 'Semana Santa', hint: 'Procesiones y tradición' },
  { to: '/festival-jazz', label: 'Festival Jazz', hint: 'Música y escenarios' },
  { to: '/tours', label: 'Tours', hint: 'Presencial y virtual' },
  { to: '/que-ver', label: 'Qué ver', hint: 'Iglesias, plazas y orfebrería' },
]

const QUICK_MOMPOSINO = [
  { to: '/semana-santa', label: 'Semana Santa', hint: 'Tu tradición local' },
  { to: '/festival-jazz', label: 'Festival Jazz', hint: 'Agenda del pueblo' },
  { to: '/historia', label: 'Historia', hint: 'Memoria compartida' },
  { to: '/tours', label: 'Tours', hint: 'Ofertas y guías' },
  { to: '/mapa', label: 'Mapa', hint: 'Referencias del casco' },
  { to: '/que-ver', label: 'Qué ver', hint: 'Patrimonio vivo' },
]

export default function Home() {
  const { audience } = useApp()
  const isLocal = audience === 'momposino'
  const quick = isLocal ? QUICK_MOMPOSINO : QUICK_VISITANTE

  return (
    <div className="page home">
      <section className="hero hero--dynamic">
        <div className="hero__glow" aria-hidden="true" />
        <p className="hero__eyebrow">Patrimonio vivo del Caribe colombiano</p>
        <h1 className="hero__title">Santa Cruz de Mompox</h1>
        <p className="hero__slogan">La tierra de Dios…</p>
        <p className="hero__helper">
          {isLocal
            ? 'Bienvenido, momposino. Aquí priorizamos eventos y vida local.'
            : 'Bienvenido, visitante. Empieza por el mapa, la historia y los recorridos.'}
        </p>
        <div className="badge-row" aria-label="Reconocimientos">
          {BADGES.map((b) => (
            <span key={b} className="badge">
              {b}
            </span>
          ))}
        </div>
        <div className="hero__actions">
          <Link to="/historia" className="btn btn--primary">
            Ver línea de tiempo
          </Link>
          <Link to="/mapa" className="btn btn--ghost">
            Explorar mapa
          </Link>
        </div>
        <div className="hero__meta">
          <VisitCounter />
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">Accesos rápidos</h2>
        <p className="section__lead">
          Orden adaptado a tu perfil ({isLocal ? 'Momposino' : 'Visitante'}).
        </p>
        <div className="quick-grid quick-grid--3">
          {quick.map((item) => (
            <Link key={item.to} to={item.to} className="quick-card">
              <span className="quick-card__label">{item.label}</span>
              <span className="quick-card__hint">{item.hint}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section--timeline-preview">
        <div className="section__head">
          <div>
            <h2 className="section__title">Historia en movimiento</h2>
            <p className="section__lead">
              Desplázate: cada hito se revela al entrar en vista. Hechos confirmados
              desde 1537 hasta UNESCO 1995.
            </p>
          </div>
          <Link to="/historia" className="btn btn--secondary btn--sm">
            Ver completa
          </Link>
        </div>
        <Timeline preview showCultural={false} />
      </section>
    </div>
  )
}
