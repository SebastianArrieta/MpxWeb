import { NavLink } from 'react-router-dom'
import { useApp, type Audience } from '../context/AppContext'
import VisitCounter from './VisitCounter'

const NAV = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/semana-santa', label: 'Semana Santa' },
  { to: '/festival-jazz', label: 'Festival Jazz' },
  { to: '/que-ver', label: 'Qué ver' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/tours', label: 'Tours' },
  { to: '/autor', label: 'Autor' },
  { to: '/contacto', label: 'Contacto' },
] as const

export default function Header() {
  const { audience, setAudience, lang, toggleLang } = useApp()

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
            aria-label="Cambiar idioma"
          >
            <span className={lang === 'es' ? 'is-on' : ''}>ES</span>
            <span className="lang-toggle__sep">|</span>
            <span className={lang === 'en' ? 'is-on' : ''}>EN</span>
          </button>

          <button
            type="button"
            className="audience-chip"
            onClick={cycleAudience}
            title="Cambiar audiencia"
          >
            {audience === 'momposino' ? 'Momposino' : 'Visitante'}
          </button>

          <VisitCounter className="visit-counter--header" />
        </div>
      </div>
    </header>
  )
}
