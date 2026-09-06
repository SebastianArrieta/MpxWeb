export default function FestivalJazz() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Festival de Jazz</h1>
        <p>Ritmos bajo el cielo momposino.</p>
      </header>

      <section className="section">
        <h2 className="section__title">Origen</h2>
        <p className="placeholder-text">
          Lorem ipsum — cómo nació el festival, su vínculo con el río y la
          comunidad. Texto placeholder del maquetado.
        </p>
      </section>

      <section className="section">
        <h2 className="section__title">Escenarios</h2>
        <div className="card-grid card-grid--3">
          {['Plaza principal', 'Malecón', 'Claustro histórico'].map((name) => (
            <article key={name} className="info-card">
              <h3>{name}</h3>
              <p>Descripción breve del escenario (stub).</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">Galería</h2>
        <div className="gallery-stub">
          {[1, 2, 3].map((n) => (
            <div key={n} className="gallery-stub__item">
              Concierto {n}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
