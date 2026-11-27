import { Link } from '../components/LocaleLink'
import { useApp } from '../context/AppContext'

export default function NotFound() {
  const { labels } = useApp()
  const l = labels.notfound
  return (
    <div className="page">
      <header className="page-header page-header--heroish notfound">
        <p className="notfound__code">{l.code}</p>
        <h1>{l.title}</h1>
        <p>{l.text}</p>
        <Link to="/" className="btn btn--primary">
          {l.cta}
        </Link>
      </header>
    </div>
  )
}