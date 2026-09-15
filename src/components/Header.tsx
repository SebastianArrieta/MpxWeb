import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp, type Audience } from '../context/AppContext'
import VisitCounter from './VisitCounter'

export default function Header() {
  const { audience, setAudience, lang, toggleLang, labels } = useApp()
  const [navOpen, setNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const NAV = [
    { to: '/historia', label: labels.nav.historia },
    { to: '/eventos', label: labels.nav.eventos },
    { to: '/mapa', label: labels.nav.mapa },
    { to: '/tours', label: labels.nav.tours },
    { to: '/contacto', label: labels.nav.contacto },
  ] as const

  const cycleAudience = () => {
    const next: Audience = audience === 'momposino' ? 'visitante' : 'momposino'
    setAudience(next)
  }

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <NavLink to="/" className="site-logo" end>
          <span className="site-logo__mark" aria-hidden="true">M</span>
          <span>Mompox</span>
        </NavLink>

        <button
          type="button"
          className={`site-nav__toggle${navOpen ? ' is-open' : ''}`}
          aria-expanded={navOpen}
          aria-controls="primary-navigation"
          aria-label={navOpen ? labels.nav.cerrarMenu : labels.nav.abrirMenu}
          onClick={() => setNavOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="primary-navigation" className={`site-nav${navOpen ? ' is-open' : ''}`} aria-label={labels.nav.principal}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setNavOpen(false)}
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
