import VisitCounter from './VisitCounter'
import { useApp } from '../context/AppContext'

export default function Footer() {
  const { labels } = useApp()
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand-block">
          <p className="site-footer__brand">{labels.shell.footerBrand}</p>
          <p className="site-footer__authors">
            {labels.authors.map((a, i) => (
              <span key={a.id}>
                {i > 0 && ' · '}
                <a href={a.instagramUrl} target="_blank" rel="noreferrer">
                  {a.name}
                </a>
              </span>
            ))}
          </p>
        </div>
        <VisitCounter />
        <p className="site-footer__note">{labels.shell.footerNote}</p>
      </div>
    </footer>
  )
}