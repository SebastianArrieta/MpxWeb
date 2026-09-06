import { useMemo, useState } from 'react'
import placesData from '../../content/places/places.json'
import categoriesData from '../../content/places/categories.json'
import { useApp } from '../context/AppContext'

type Place = (typeof placesData.items)[number]
type MobileView = 'lista' | 'mapa'

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
  const { labels } = useApp()
  const mapaLabels = labels.mapa
  const catLabel = (id: string) => (mapaLabels.filtros as Record<string, string>)[id] ?? id

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
    setMobileView('mapa')
  }

  function renderFicha(place: Place, asSheet: boolean) {
    const f = mapaLabels.ficha
    return (
      <article className={asSheet ? 'map-sheet' : 'map-card'} aria-live="polite">
        {asSheet ? (
          <button
            type="button"
            className="map-sheet__close"
            aria-label={mapaLabels.cerrarFicha}
            onClick={() => setSelectedId(null)}
          >
            {mapaLabels.cerrarFicha}
          </button>
        ) : null}
        <div className="map-card__foto">{f.sinFoto}</div>
        <h3>{place.nombre_es}</h3>
        <p>{place.descripcion_es}</p>
        <ul className="stub-list">
          <li>
            {f.coords}:{' '}
            {place.lat != null && place.lng != null
              ? `${place.lat}, ${place.lng}`
              : 'pendiente'}
          </li>
          <li>{f.horario}: {place.horario ?? 'pendiente'}</li>
          <li>{f.telefono}: {place.telefono ?? 'pendiente'}</li>
          {place.pendiente_campos?.length ? (
            <li>
              {f.pendiente}: {place.pendiente_campos.join(', ')}
            </li>
          ) : null}
        </ul>
        {mapsUrl ? (
          <a className="btn btn--primary" href={mapsUrl} target="_blank" rel="noreferrer">
            {f.comoLlegar}
          </a>
        ) : (
          <p className="placeholder-text">{f.sinRuta}</p>
        )}
      </article>
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>{mapaLabels.title}</h1>
        <p>{mapaLabels.tagline}</p>
      </header>

      <section className="map-toolbar">
        <input
          type="search"
          className="map-search"
          placeholder={mapaLabels.buscar}
          aria-label={mapaLabels.buscar}
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
              {catLabel(c.id)}
            </button>
          ))}
        </div>
        <div className="map-view-toggle" role="group" aria-label={mapaLabels.vistaAria}>
          <button
            type="button"
            className={`chip-filter${mobileView === 'lista' ? ' is-active' : ''}`}
            aria-pressed={mobileView === 'lista'}
            onClick={() => setMobileView('lista')}
          >
            {mapaLabels.vistaLista}
          </button>
          <button
            type="button"
            className={`chip-filter${mobileView === 'mapa' ? ' is-active' : ''}`}
            aria-pressed={mobileView === 'mapa'}
            onClick={() => setMobileView('mapa')}
          >
            {mapaLabels.vistaMapa}
          </button>
        </div>
      </section>

      <section className={`map-layout map-layout--${mobileView}`}>
        <aside className="map-list" aria-label={mapaLabels.listaAria}>
          <h2 className="map-list__title">
            {mapaLabels.lugaresCount.replace('{n}', String(filtered.length))}
          </h2>
          {filtered.length === 0 ? (
            <p className="placeholder-text">{mapaLabels.listaVacia}</p>
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
                    <span>{catLabel(p.categoria)}</span>
                    {p.pendiente ? <em>{mapaLabels.pendiente}</em> : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className="map-panel map-panel--live" aria-label={mapaLabels.panelAria}>
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
              {mapaLabels.panelCentro
                .replace('{lat}', center.lat.toFixed(4))
                .replace('{lng}', center.lng.toFixed(4))}
              <br />
              <small>{mapaLabels.panelNota}</small>
            </p>
          </div>

          {selected ? (
            <div className="map-ficha-desktop">{renderFicha(selected, false)}</div>
          ) : null}
        </div>
      </section>

      {selected ? <div className="map-sheet-wrap">{renderFicha(selected, true)}</div> : null}
    </div>
  )
}