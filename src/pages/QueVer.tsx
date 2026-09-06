const SIGHTS = [
  { title: 'Iglesia de Santa Bárbara', text: 'Ícono barroco junto al río. Stub.' },
  { title: 'Cementerio municipal', text: 'Arquitectura funeraria y quietud. Stub.' },
  { title: 'Casa de la Cultura', text: 'Memoria e historia local. Stub.' },
  { title: 'Malecón fluvial', text: 'Atardeceres y paseo ribereño. Stub.' },
]

export default function QueVer() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Qué ver</h1>
        <p>Cuatro puntos de partida para descubrir Mompox.</p>
      </header>

      <section className="section">
        <div className="card-grid card-grid--2">
          {SIGHTS.map((s) => (
            <article key={s.title} className="info-card info-card--accent">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
