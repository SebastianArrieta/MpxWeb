import { NavLink } from 'react-router-dom'
import { useApp, type Audience } from '../context/AppContext'
import VisitCounter from './VisitCounter'

export default function Header() {
  const { audience, setAudience, lang, toggleLang, labels } = useApp()

  const NAV = [
    { to: '/', label: labels.nav.inicio, end: true },
    { to: '/historia', label: labels.nav.historia },
    { to: '/semana-santa', label: labels.nav.semanaSanta },
    { to: '/festival-jazz', label: labels.nav.festivalJazz },
    { to: '/que-ver', label: labels.nav.queVer },
    { to: '/mapa', label: labels.nav.mapa },
    { to: '/tours', label: labels.nav.tours },
    { to: '/autor', label: labels.nav.autor },
    { to: '/contacto', label: labels.nav.contacto },
  ] as const

  const cycleAudience = () => {
    const next: Audience = audience === 'momposino' ? 'visitante' : 'momposino'
    setAudience(next)
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="site-logo" end>
          Mompox
        </NavLink>

        <nav className="site-nav" aria-label="Principal">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={'end' in item ? item.end : false}
              className={({ isActive }) =>
                isActive ? 'site-nav__link is-active' : 'site-nav__link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__tools">
          <button
            type="button"
            className="lang-toggle"
            onClick={toggleLang}
            aria-label={labels.idioma.aria}
          >
            <span className={lang === 'es' ? 'is-on' : ''}>{labels.idioma.es}</span>
            <span className="lang-toggle__sep">|</span>
            <span className={lang === 'en' ? 'is-on' : ''}>{labels.idioma.en}</span>
          </button>

          <button
            type="button"
            className="audience-chip"
            onClick={cycleAudience}
            title={labels.audiencia.cambiar}
          >
            {audience === 'momposino'
              ? labels.audiencia.chipMomposino
              : labels.audiencia.chipVisitante}
          </button>

          <VisitCounter className="visit-counter--header" />
        </div>
      </div>
    </header>
  )
}