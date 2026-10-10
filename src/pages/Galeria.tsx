import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import Gallery from '../components/Gallery'
import Reveal from '../components/Reveal'

export default function Galeria() {
  const { labels } = useApp()
  const l = labels.galeriaPagina
  const [filter, setFilter] = useState('todos')
  const fotos = useMemo(
    () => filter === 'todos' ? l.fotos : l.fotos.filter((foto) => foto.categoria === filter),
    [filter, l.fotos],
  )
  return (
    <div className="page">
      <header className="page-header">
        <h1>{l.title}</h1>
        <p>{l.tagline}</p>
      </header>
      <nav className="gallery-filters" aria-label={l.title}>
        {Object.entries(l.filtros).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`chip-filter${filter === id ? ' is-active' : ''}`}
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      <p className="gallery__note">{l.nota}</p>
      <Reveal>
        <Gallery items={fotos} label={l.title} />
      </Reveal>
    </div>
  )
}
