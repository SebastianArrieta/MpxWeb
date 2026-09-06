const PLACES = [
  'Iglesia de Santa Bárbara',
  'Plaza de la Concepción',
  'Malecón',
  'Casa del Artesano',
  'Puerto fluvial',
]

export default function Mapa() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Mapa</h1>
        <p>Explora el casco histórico (shell de layout, sin mapa real aún).</p>
      </header>

      <section className="map-toolbar">
        <input
          type="search"
          className="map-search"
          placeholder="Buscar lugar…"
          aria-label="Buscar lugar"
        />
        <div className="map-filters">
          {['Todo', 'Iglesias', 'Museos', 'Gastronomía', 'Tours'].map((f) => (
            <button key={f} type="button" className="chip-filter">
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="map-layout">
        <aside className="map-list" aria-label="Listado de lugares">
          <h2 className="map-list__title">Lugares</h2>
          <ul>
            {PLACES.map((p) => (
              <li key={p}>
                <button type="button" className="map-list__item">
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className="map-panel" role="img" aria-label="Panel de mapa placeholder">
          <div className="map-panel__inner">
            <span>Mapa</span>
            <small>Panel placeholder — sin API de mapas aún</small>
          </div>
        </div>
      </section>
    </div>
  )
}
