import { useEffect, useMemo, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import placesData from '../../content/places/places.json'
import categoriesData from '../../content/places/categories.json'
import { useApp } from '../context/AppContext'

type Place = (typeof placesData.items)[number]
type MappedPlace = Place & { lat: number; lng: number; ubicacion_verificada: true }
type MobileView = 'lista' | 'mapa'

const center: [number, number] = [placesData.meta.map_center.lng, placesData.meta.map_center.lat]
const categoryColors: Record<string, string> = {
  sitios: '#b5532e',
  restaurantes: '#d9a441',
  hoteles: '#5e7f3a',
  parqueaderos: '#6b5a45',
  artesanias: '#0081c0',
  servicios: '#525d66',
}

const mapStyle: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
}

export default function Mapa() {
  const { labels, lang } = useApp()
  const mapaLabels = labels.mapa
  const catLabel = (id: string) => (mapaLabels.filtros as Record<string, string>)[id] ?? id
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map())
  const markerElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [mapReady, setMapReady] = useState(false)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('todos')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<MobileView>('mapa')
  const mappedPlaces = placesData.items.filter(
    (place): place is MappedPlace =>
      place.ubicacion_verificada === true && typeof place.lat === 'number' && typeof place.lng === 'number',
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(lang)
    return mappedPlaces.filter((place) => {
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

  const selected = mappedPlaces.find((place) => place.id === selectedId)
  const placeName = (place: Place) => (lang === 'en' ? place.nombre_en : place.nombre_es)
  const placeDescription = (place: Place) =>
    lang === 'en' ? place.descripcion_en : place.descripcion_es

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center,
      zoom: placesData.meta.map_center.zoom,
      minZoom: 11,
      maxZoom: 19,
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    const onStyleLoad = () => {
      setMapReady(true)
      window.requestAnimationFrame(() => map.resize())
    }
    map.on('style.load', onStyleLoad)
    mapRef.current = map

    return () => {
      map.off('style.load', onStyleLoad)
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current.clear()
      markerElementsRef.current.clear()
      map.remove()
      mapRef.current = null
      setMapReady(false)
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current.clear()
    markerElementsRef.current.clear()

    filtered.forEach((place) => {
      const markerElement = document.createElement('button')
      markerElement.type = 'button'
      markerElement.className = 'map-marker'
      markerElement.style.backgroundColor = categoryColors[place.categoria] ?? '#525d66'
      markerElement.setAttribute('aria-label', placeName(place))
      markerElement.title = placeName(place)
      markerElement.addEventListener('click', () => {
        setSelectedId(place.id)
        setMobileView('mapa')
      })

      const marker = new maplibregl.Marker({ element: markerElement, anchor: 'center' })
        .setLngLat([place.lng, place.lat])
        .addTo(map)

      markersRef.current.set(place.id, marker)
      markerElementsRef.current.set(place.id, markerElement)
    })

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current.clear()
      markerElementsRef.current.clear()
    }
  }, [filtered, lang, mapReady])

  useEffect(() => {
    markerElementsRef.current.forEach((element, id) => {
      element.classList.toggle('is-active', id === selectedId)
    })
  }, [selectedId, filtered])

  useEffect(() => {
    if (!selected || !mapRef.current || !mapReady) return
    mapRef.current.flyTo({
      center: [selected.lng, selected.lat],
      zoom: Math.max(mapRef.current.getZoom(), 16),
      duration: 550,
    })
  }, [selected, mapReady])

  useEffect(() => {
    if (!mapRef.current) return
    const frame = window.requestAnimationFrame(() => mapRef.current?.resize())
    return () => window.cancelAnimationFrame(frame)
  }, [mobileView])

  useEffect(() => {
    if (selectedId && !filtered.some((place) => place.id === selectedId)) setSelectedId(null)
  }, [filtered, selectedId])

  const directions = (place: Place) => {
    const destination = `${placeName(place)}, Santa Cruz de Mompox, Bolívar, Colombia`
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
  }

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
        <p className="map-verification-note">{mapaLabels.notaVerificacion}</p>
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
            <span className="map-list__total">{mappedPlaces.length}</span>
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
          <div ref={mapContainer} className="maplibre-map" />
          {selected ? <div className="map-ficha-desktop">{renderPlaceCard(selected)}</div> : null}
        </div>
      </section>

      {selected ? <div className="map-sheet-wrap">{renderPlaceCard(selected, true)}</div> : null}
    </div>
  )
}
