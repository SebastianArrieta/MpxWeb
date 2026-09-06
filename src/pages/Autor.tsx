export default function Autor() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Autor</h1>
        <p>Quién impulsa este proyecto turístico.</p>
      </header>

      <section className="section author-stub">
        <div className="author-stub__avatar" aria-hidden="true">
          A
        </div>
        <div className="author-stub__body">
          <h2>Alfredo — @alfredompox</h2>
          <p className="placeholder-text">
            Perfil stub: guía local, promotor cultural y narrador de Mompox.
            Aquí irá biografía, foto y enlaces cuando el contenido esté listo.
          </p>
          <ul className="stub-list">
            <li>Redes: @alfredompox</li>
            <li>Enfoque: patrimonio, turismo responsable</li>
            <li>Ubicación: Santa Cruz de Mompox</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
