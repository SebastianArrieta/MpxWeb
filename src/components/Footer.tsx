import VisitCounter from './VisitCounter'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__brand">Mompox — maquetado turístico</p>
        <VisitCounter />
        <p className="site-footer__note">Estructura placeholder · sin APIs aún</p>
      </div>
    </footer>
  )
}
