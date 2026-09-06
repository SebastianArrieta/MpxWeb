import { useMemo, useState } from 'react'
import placesData from '../data/places.json'
import categoriesData from '../data/categories.json'

type Place = (typeof placesData.items)[number]
type MobileView = 'lista' | 'mapa'

const CAT_LABELS: Record<string, string> = {
  todos: 'Todos',
  sitios: 'Sitios',
  restaurantes: 'Restaurantes',
  hoteles: 'Hoteles',
  parqueaderos: 'Parqueaderos',
  artesanias: 'Artesanías',
  iglesias: 'Iglesias',
  servicios: 'Servicios',
}

const center = placesData.meta.map_center

function project(lat: number, lng: number) {
  const x = 50 + (lng - center.lng) * 1800
  const y = 50 - (lat - center.lat) * 1800
  return {
    left: `${Math.min(92, Math.max(8, x))}%`,
    top: `${Math.min(88, Math.max(12, y))}%`,
  }
}

export default function Mapa() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('todos')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<MobileView>('lista')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return placesData.items.filter((p) => {
      if (cat !== 'todos' && p.categoria !== cat) return false
      if (!q) return true
      return (
        p.nombre_es.toLowerCase().includes(q) ||
        p.descripcion_es.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
      )
    })
  }, [query, cat])

  const selected: Place | undefined = placesData.items.find((p) => p.id === selectedId)

  const mapsUrl =
    selected && selected.lat != null && selected.lng != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`
      : null

  function pickPlace(id: string) {
    setSelectedId(id)
    // En móvil, al elegir un lugar pasamos a mapa + ficha (bottom sheet)
    setMobileView('mapa')
  }

  function renderFicha(place: Place, asSheet: boolean) {
    return (
      <article className={asSheet ? 'map-sheet' : 'map-card'} aria-live="polite">
        {asSheet ? (
          <button
            type="button"
            className="map-sheet__close"
            aria-label="Cerrar ficha"
            onClick={() => setSelectedId(null)}
          >
            Cerrar
          </button>
        ) : null}
        <div className="map-card__foto">Foto pendiente</div>
        <h3>{place.nombre_es}</h3>
        <p>{place.descripcion_es}</p>
        <ul className="stub-list">
          <li>
            Coords:{' '}
            {place.lat != null && place.lng != null
              ? `${place.lat}, ${place.lng}`
              : 'pendiente'}
          </li>
          <li>Horario: {place.horario ?? 'pendiente'}</li>
          <li>Teléfono: {place.telefono ?? 'pendiente'}</li>
          {place.pendiente_campos?.length ? (
            <li>Pendiente: {place.pendiente_campos.join(', ')}</li>
          ) : null}
        </ul>
        {mapsUrl ? (
          <a className="btn btn--primary" href={mapsUrl} target="_blank" rel="noreferrer">
            Cómo llegar
          </a>
        ) : (
          <p className="placeholder-text">Sin coordenadas para abrir ruta.</p>
        )}
      </article>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Mapa</h1>
        <p>Explora lugares del casco histórico (datos iniciales; varios campos pendientes).</p>
      </header>

      <section className="map-toolbar">
        <input
          type="search"
          className="map-search"
          placeholder="Buscar lugar…"
          aria-label="Buscar lugar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="map-filters">
          {categoriesData.items.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip-filter${cat === c.id ? ' is-active' : ''}`}
              aria-pressed={cat === c.id}
              onClick={() => setCat(c.id)}
            >
              {CAT_LABELS[c.id] ?? c.id}
            </button>
          ))}
        </div>
        <div className="map-view-toggle" role="group" aria-label="Vista móvil">
          <button
            type="button"
            className={`chip-filter${mobileView === 'lista' ? ' is-active' : ''}`}
            aria-pressed={mobileView === 'lista'}
            onClick={() => setMobileView('lista')}
          >
            Lista
          </button>
          <button
            type="button"
            className={`chip-filter${mobileView === 'mapa' ? ' is-active' : ''}`}
            aria-pressed={mobileView === 'mapa'}
            onClick={() => setMobileView('mapa')}
          >
            Mapa
          </button>
        </div>
      </section>

      <section className={`map-layout map-layout--${mobileView}`}>
        <aside className="map-list" aria-label="Listado de lugares">
          <h2 className="map-list__title">Lugares ({filtered.length})</h2>
          {filtered.length === 0 ? (
            <p className="placeholder-text">No hay lugares con estos filtros.</p>
          ) : (
            <ul>
              {filtered.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`map-list__item${selected?.id === p.id ? ' is-active' : ''}`}
                    onClick={() => pickPlace(p.id)}
                  >
                    <strong>{p.nombre_es}</strong>
                    <span>{CAT_LABELS[p.categoria] ?? p.categoria}</span>
                    {p.pendiente ? <em>Pendiente</em> : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className="map-panel map-panel--live" aria-label="Panel de mapa">
          <div className="map-panel__canvas">
            {filtered
              .filter((p) => p.lat != null && p.lng != null)
              .map((p) => {
                const pos = project(p.lat as number, p.lng as number)
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`map-marker${selected?.id === p.id ? ' is-active' : ''}`}
                    style={{ left: pos.left, top: pos.top }}
                    title={p.nombre_es}
                    aria-label={p.nombre_es}
                    onClick={() => setSelectedId(p.id)}
                  />
                )
              })}
            <p className="map-panel__label">
              Centro aprox. {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
              <br />
              <small>Maquetado — Google Maps después</small>
            </p>
          </div>

          {/* Desktop: ficha en panel */}
          {selected ? (
            <div className="map-ficha-desktop">{renderFicha(selected, false)}</div>
          ) : null}
        </div>
      </section>

      {/* Móvil: ficha bottom sheet */}
      {selected ? <div className="map-sheet-wrap">{renderFicha(selected, true)}</div> : null}
    </div>
  )
}
