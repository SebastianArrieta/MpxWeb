import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import placesData from '../../content/places/places.json'
import categoriesData from '../../content/places/categories.json'
import { useApp } from '../context/AppContext'

type Place = (typeof placesData.items)[number]
type MobileView = 'lista' | 'mapa'

const center: LatLngExpression = [placesData.meta.map_center.lat, placesData.meta.map_center.lng]
const categoryColors: Record<string, string> = {
  sitios: '#b5532e',
  restaurantes: '#d9a441',
  hoteles: '#5e7f3a',
  parqueaderos: '#6b5a45',
  artesanias: '#0081c0',
  servicios: '#525d66',
}

function MapFocus({ selected }: { selected?: Place }) {
  const map = useMap()
  useEffect(() => {
    if (selected) map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 16), { duration: 0.55 })
  }, [selected, map])
  return null
}

function MapLayoutSync({ view }: { view: MobileView }) {
  const map = useMap()
  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize({ pan: false }), 120)
    return () => window.clearTimeout(timer)
  }, [view, map])
  return null
}

export default function Mapa() {
  const { labels, lang } = useApp()
  const mapaLabels = labels.mapa
  const catLabel = (id: string) => (mapaLabels.filtros as Record<string, string>)[id] ?? id
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('todos')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<MobileView>('lista')

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(lang)
    return placesData.items.filter((place) => {
      if (cat !== 'todos' && place.categoria !== cat) return false
      if (!q) return true
      const fields = [
        place.nombre_es,
        place.nombre_en,
        place.descripcion_es,
        place.descripcion_en,
        catLabel(place.categoria),
      ]
      return fields.some((field) => field.toLocaleLowerCase(lang).includes(q))
    })
  }, [query, cat, lang])

  const selected = placesData.items.find((place) => place.id === selectedId)

  useEffect(() => {
    if (selectedId && !filtered.some((place) => place.id === selectedId)) setSelectedId(null)
  }, [filtered, selectedId])

  const placeName = (place: Place) => (lang === 'en' ? place.nombre_en : place.nombre_es)
  const placeDescription = (place: Place) =>
    lang === 'en' ? place.descripcion_en : place.descripcion_es

  const directions = (place: Place) =>
    `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`

  const pickPlace = (id: string) => {
    setSelectedId(id)
    setMobileView('mapa')
  }

  const renderPlaceCard = (place: Place, sheet = false) => (
    <article className={sheet ? 'map-sheet' : 'map-card'} aria-live="polite">
      {sheet ? (
        <button
          type="button"
          className="map-sheet__close"
          aria-label={mapaLabels.cerrarFicha}
          onClick={() => setSelectedId(null)}
        >
          {mapaLabels.cerrarFicha}
        </button>
      ) : null}
      <span className="map-card__category">{catLabel(place.categoria)}</span>
      <h3>{placeName(place)}</h3>
      <p>{placeDescription(place)}</p>
      {place.pendiente_campos.length ? (
        <p className="map-card__note">
          {mapaLabels.pendiente}: {place.pendiente_campos.join(', ')}
        </p>
      ) : null}
      <a className="btn btn--primary" href={directions(place)} target="_blank" rel="noreferrer">
        {mapaLabels.ficha.comoLlegar} ↗
      </a>
    </article>
  )

  return (
    <div className="page page--map">
      <header className="page-header">
        <p className="page-header__eyebrow">Mompox · Bolívar</p>
        <h1>{mapaLabels.title}</h1>
        <p>{mapaLabels.tagline}</p>
      </header>

      <section className="map-toolbar" aria-label={mapaLabels.title}>
        <label className="map-search-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            className="map-search"
            placeholder={mapaLabels.buscar}
            aria-label={mapaLabels.buscar}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="map-filters" role="group" aria-label={mapaLabels.title}>
          {categoriesData.items.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`chip-filter${cat === category.id ? ' is-active' : ''}`}
              aria-pressed={cat === category.id}
              onClick={() => setCat(category.id)}
            >
              {catLabel(category.id)}
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
          <div className="map-list__heading">
            <h2 className="map-list__title">
              {mapaLabels.lugaresCount.replace('{n}', String(filtered.length))}
            </h2>
            <span className="map-list__total">23</span>
          </div>
          {filtered.length === 0 ? (
            <p className="placeholder-text">{mapaLabels.listaVacia}</p>
          ) : (
            <ul>
              {filtered.map((place) => (
                <li key={place.id}>
                  <button
                    type="button"
                    className={`map-list__item${selected?.id === place.id ? ' is-active' : ''}`}
                    onClick={() => pickPlace(place.id)}
                  >
                    <span
                      className="map-list__dot"
                      style={{ backgroundColor: categoryColors[place.categoria] }}
                      aria-hidden="true"
                    />
                    <span className="map-list__copy">
                      <strong>{placeName(place)}</strong>
                      <span>{catLabel(place.categoria)}</span>
                    </span>
                    <span className="map-list__arrow" aria-hidden="true">↗</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <div className="map-panel map-panel--live" aria-label={mapaLabels.panelAria}>
          <MapContainer
            center={center}
            zoom={placesData.meta.map_center.zoom}
            minZoom={11}
            maxZoom={19}
            scrollWheelZoom={false}
            className="leaflet-map"
            >
            <MapLayoutSync view={mobileView} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapFocus selected={selected} />
            {filtered.map((place) => (
              <CircleMarker
                key={place.id}
                center={[place.lat, place.lng]}
                radius={selected?.id === place.id ? 10 : 7}
                pathOptions={{
                  color: '#fffdf9',
                  weight: 3,
                  fillColor: categoryColors[place.categoria],
                  fillOpacity: 1,
                }}
                eventHandlers={{ click: () => setSelectedId(place.id) }}
              >
                <Popup>
                  <div className="map-popup">
                    <strong>{placeName(place)}</strong>
                    <span>{catLabel(place.categoria)}</span>
                    <p>{placeDescription(place)}</p>
                    <a href={directions(place)} target="_blank" rel="noreferrer">
                      {mapaLabels.ficha.comoLlegar} ↗
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
          {selected ? <div className="map-ficha-desktop">{renderPlaceCard(selected)}</div> : null}
          <p className="map-attribution">{mapaLabels.panelNota}</p>
        </div>
      </section>

      {selected ? <div className="map-sheet-wrap">{renderPlaceCard(selected, true)}</div> : null}
    </div>
  )
}
