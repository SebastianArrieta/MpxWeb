const PRESENCIAL = [
  { title: 'Recorrido histórico', meta: '2 h · a pie' },
  { title: 'Ruta fluvial', meta: '1.5 h · río' },
  { title: 'Artesanos y orfebrería', meta: '2 h · talleres' },
]

const VIRTUAL = [
  { title: 'Casco 360°', meta: 'Online · 30 min' },
  { title: 'Semana Santa VR', meta: 'Online · 20 min' },
  { title: 'Jazz en casa', meta: 'Streaming · archivo' },
]

export default function Tours() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Tours</h1>
        <p>Experiencias presenciales y virtuales (maquetado).</p>
      </header>

      <section className="section">
        <h2 className="section__title">Presencial</h2>
        <div className="card-grid card-grid--3">
          {PRESENCIAL.map((t) => (
            <article key={t.title} className="info-card">
              <span className="info-card__tag">Presencial</span>
              <h3>{t.title}</h3>
              <p>{t.meta}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">Virtual</h2>
        <div className="card-grid card-grid--3">
          {VIRTUAL.map((t) => (
            <article key={t.title} className="info-card info-card--teal">
              <span className="info-card__tag">Virtual</span>
              <h3>{t.title}</h3>
              <p>{t.meta}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
