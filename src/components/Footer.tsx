import { NavLink } from 'react-router-dom'
import VisitCounter from './VisitCounter'
import { useApp } from '../context/AppContext'

export default function Footer() {
  const { labels, audience, resetAudience } = useApp()
  const profile = audience === 'momposino'
    ? labels.audiencia.chipMomposino
    : labels.audiencia.chipVisitante
  const siteLinks = [
    { to: '/mapa', label: labels.nav.mapa },
    { to: '/itinerarios', label: labels.nav.itinerarios },
    { to: '/como-llegar', label: labels.nav.comoLlegar },
    { to: '/galeria', label: labels.nav.galeria },
    { to: '/semana-santa', label: labels.nav.semanaSanta },
    { to: '/festival-jazz', label: labels.nav.festivalJazz },
    { to: '/historia', label: labels.nav.historia },
    { to: '/tours', label: labels.nav.tours },
    { to: '/contacto', label: labels.nav.contacto },
  ]

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__brand-block">
          <p className="site-footer__brand">{labels.shell.footerBrand}</p>
          <p className="site-footer__tagline">{labels.site.slogan}</p>
          <VisitCounter />
        </div>

        <nav className="site-footer__links" aria-label={labels.nav.principal}>
          {siteLinks.map((item) => (
            <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
          ))}
        </nav>

        <div className="site-footer__connect">
          <p className="site-footer__connect-title">{labels.shell.conecta}</p>
          <ul>
            {labels.authors.map((author) => (
              <li key={`${author.id}-instagram`}>
                <a href={author.instagramUrl} target="_blank" rel="noreferrer">
                  Instagram — @{author.instagram}
                </a>
              </li>
            ))}
            {labels.authors.map((author) => (
              <li key={`${author.id}-github`}>
                <a href={author.githubUrl} target="_blank" rel="noreferrer">
                  GitHub — {author.name.split(' ')[0]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>{labels.shell.footerNote} — {labels.shell.footerCreators}</p>
        <p className="site-footer__profile-line">
          {profile} ·{' '}
          <button type="button" className="site-footer__profile" onClick={resetAudience}>
            {labels.audiencia.cambiar}
          </button>
        </p>
      </div>
    </footer>
  )
}
