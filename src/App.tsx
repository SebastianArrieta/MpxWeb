import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Eventos from './pages/Eventos'
import QueVer from './pages/QueVer'
import Mapa from './pages/Mapa'
import Tours from './pages/Tours'
import Autor from './pages/Autor'
import Contacto from './pages/Contacto'
import Historia from './pages/Historia'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/semana-santa" element={<Navigate to="/eventos#semana-santa" replace />} />
          <Route path="/festival-jazz" element={<Navigate to="/eventos#festijazz" replace />} />
          <Route path="/que-ver" element={<QueVer />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/autor" element={<Autor />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
