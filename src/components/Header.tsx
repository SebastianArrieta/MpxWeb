import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { NavLink } from './LocaleLink'
import { localizePath, stripLocale } from '../i18n/locale'
import { useApp } from '../context/AppContext'
import VisitCounter from './VisitCounter'

export default function Header() {
  const { lang, labels } = useApp()
  const { pathname, search, hash } = useLocation()
  const otherLang = lang === 'es' ? 'en' : 'es'
  // Enlace real (no solo un botón) para que buscadores encuentren la otra versión.
  const otherLangHref = localizePath(stripLocale(pathname), otherLang) + search + hash
  const [navOpen, setNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeNav = () => {
    setNavOpen(false)
    navRef.current?.querySelectorAll('details[open]').forEach((item) => item.removeAttribute('open'))
  }

  const discover = [
    { to: '/semana-santa', label: labels.nav.semanaSanta },
    { to: '/festival-jazz', label: labels.nav.festivalJazz },
    { to: '/que-ver', label: labels.nav.queVer },
    { to: '/galeria', label: labels.nav.galeria },
    { to: '/historia', label: labels.nav.historia },
  ]
  const planning = [
    { to: '/guia-practica', label: labels.nav.guiaPractica },
    { to: '/como-llegar', label: labels.nav.comoLlegar },
    { to: '/itinerarios', label: labels.nav.itinerarios },
    { to: '/tours', label: labels.nav.tours },
  ]

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <NavLink to="/" className="site-logo" end>
          <span className="site-logo__name">Mompox<span aria-hidden="true">.</span></span>
          <span className="site-logo__country">Colombia</span>
        </NavLink>

        <nav
          id="primary-navigation"
          ref={navRef}
          className={`site-nav${navOpen ? ' is-open' : ''}`}
          aria-label={labels.nav.principal}
        >
          <details className="site-nav-group">
            <summary>{labels.nav.descubre}</summary>
            <div className="site-nav-group__menu">
              {discover.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={closeNav}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </details>
          <details className="site-nav-group">
            <summary>{labels.nav.planea}</summary>
            <div className="site-nav-group__menu">
              {planning.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={closeNav}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </details>
          <details className="site-nav-group">
            <summary>{labels.nav.nosotros}</summary>
            <div className="site-nav-group__menu">
              <NavLink to="/sobre-nosotros" onClick={closeNav}>{labels.nav.sobreNosotros}</NavLink>
              <NavLink to="/contacto" onClick={closeNav}>{labels.nav.contacto}</NavLink>
            </div>
          </details>
          <NavLink to="/mapa" onClick={closeNav} className="site-nav__map-link">
            {labels.nav.mapa}
          </NavLink>
        </nav>

        <div className="site-header__tools">
          <RouterLink
            to={otherLangHref}
            className="lang-toggle"
            hrefLang={otherLang}
            aria-label={labels.idioma.aria}
            onClick={closeNav}
          >
            <span className={lang === 'es' ? 'is-on' : ''}>{labels.idioma.es}</span>
            <span className="lang-toggle__sep">|</span>
            <span className={lang === 'en' ? 'is-on' : ''}>{labels.idioma.en}</span>
          </RouterLink>

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

          <VisitCounter className="visit-counter--header" />
        </div>
      </div>
    </header>
  )
}
