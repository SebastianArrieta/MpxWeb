import Timeline from '../components/Timeline'

export default function Historia() {
  return (
    <div className="page page--historia">
      <header className="page-header page-header--heroish">
        <p className="page-header__eyebrow">Memoria del río Magdalena</p>
        <h1>Historia de Mompox</h1>
        <p>
          Línea de tiempo con hitos confirmados: fundación, independencia, Bolívar,
          Monumento Nacional y Patrimonio UNESCO. Desplázate para revelar cada
          momento.
        </p>
      </header>

      <section className="section section--timeline" aria-label="Línea de tiempo">
        <Timeline />
      </section>
    </div>
  )
}
