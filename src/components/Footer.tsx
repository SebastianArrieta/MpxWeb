import { NavLink } from './LocaleLink'
import VisitCounter from './VisitCounter'
import { useApp } from '../context/AppContext'

export default function Footer() {
  const { labels, audience, setAudience } = useApp()
  const isLocal = audience === 'momposino'
  const profile = isLocal ? labels.audiencia.chipMomposino : labels.audiencia.chipVisitante
  const other = isLocal ? labels.audiencia.chipVisitante : labels.audiencia.chipMomposino

  const discoverLinks = [
    { to: '/semana-santa', label: labels.nav.semanaSanta },
    { to: '/festival-jazz', label: labels.nav.festivalJazz },
    { to: '/que-ver', label: labels.nav.queVer },
    { to: '/galeria', label: labels.nav.galeria },
    { to: '/historia', label: labels.nav.historia },
  ]

  const planLinks = [
    { to: '/mapa', label: labels.nav.mapa },
    { to: '/itinerarios', label: labels.nav.itinerarios },
    { to: '/como-llegar', label: labels.nav.comoLlegar },
    { to: '/guia-practica', label: labels.nav.guiaPractica },
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

        <nav className="site-footer__col" aria-label={labels.nav.descubre}>
          <p className="site-footer__col-title">{labels.nav.descubre}</p>
          <ul className="site-footer__list">
            {discoverLinks.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="site-footer__col" aria-label={labels.nav.planea}>
          <p className="site-footer__col-title">{labels.nav.planea}</p>
          <ul className="site-footer__list">
            {planLinks.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__connect site-footer__col">
          <p className="site-footer__connect-title site-footer__col-title">{labels.shell.conecta}</p>
          <ul className="site-footer__list">
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
          <button
            type="button"
            className="site-footer__profile"
            onClick={() => setAudience(isLocal ? 'visitante' : 'momposino')}
          >
            {labels.audiencia.cambiarA.replace('{perfil}', other)}
          </button>
        </p>
      </div>
    </footer>
  )
}
