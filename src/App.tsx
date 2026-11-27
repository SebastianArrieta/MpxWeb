import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Eventos from './pages/Eventos'
import QueVer from './pages/QueVer'
import Tours from './pages/Tours'
import Autor from './pages/Autor'
import Contacto from './pages/Contacto'
import Historia from './pages/Historia'
import Galeria from './pages/Galeria'
import ComoLlegar from './pages/ComoLlegar'
import Itinerarios from './pages/Itinerarios'
import EventoDetalle from './pages/EventoDetalle'
import NotFound from './pages/NotFound'

const Mapa = lazy(() => import('./pages/Mapa'))

/**
 * Las mismas páginas en dos idiomas: español en la raíz e inglés bajo /en.
 * Rutas relativas para poder montarlas en ambos prefijos.
 */
const pages = (
  <>
    <Route index element={<Home />} />
    <Route path="historia" element={<Historia />} />
    <Route path="eventos" element={<Eventos />} />
    <Route path="semana-santa" element={<EventoDetalle tipo="semanaSanta" />} />
    <Route path="festival-jazz" element={<EventoDetalle tipo="festivalJazz" />} />
    <Route path="que-ver" element={<QueVer />} />
    <Route
      path="mapa"
      element={
        <Suspense fallback={<p className="map-loading" role="status">Cargando mapa…</p>}>
          <Mapa />
        </Suspense>
      }
    />
    <Route path="tours" element={<Tours />} />
    <Route path="galeria" element={<Galeria />} />
    <Route path="como-llegar" element={<ComoLlegar />} />
    <Route path="itinerarios" element={<Itinerarios />} />
    <Route path="autor" element={<Autor />} />
    <Route path="sobre-nosotros" element={<Autor />} />
    <Route path="contacto" element={<Contacto />} />
    <Route path="*" element={<NotFound />} />
  </>
)

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="en">{pages}</Route>
          <Route path="/">{pages}</Route>
        </Route>
      </Routes>
    </>
  )
}
