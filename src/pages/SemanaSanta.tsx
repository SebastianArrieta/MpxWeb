export default function SemanaSanta() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Semana Santa</h1>
        <p>Procesiones, fe y patrimonio vivo en Mompox.</p>
      </header>

      <section className="section">
        <h2 className="section__title">Historia</h2>
        <p className="placeholder-text">
          Lorem ipsum — breve relato histórico de la Semana Santa momposina.
          Tradición colonial, hermandades y memoria colectiva. (stub)
        </p>
      </section>

      <section className="section">
        <h2 className="section__title">Procesiones</h2>
        <ul className="stub-list">
          <li>Domingo de Ramos — recorrido placeholder</li>
          <li>Jueves Santo — pasos y calles principales</li>
          <li>Viernes Santo — silencio y velas</li>
          <li>Sábado de Gloria — cierre simbólico</li>
        </ul>
      </section>

      <section className="section">
        <h2 className="section__title">Galería</h2>
        <div className="gallery-stub">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="gallery-stub__item">
              Foto {n}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
