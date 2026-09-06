import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import SemanaSanta from './pages/SemanaSanta'
import FestivalJazz from './pages/FestivalJazz'
import QueVer from './pages/QueVer'
import Mapa from './pages/Mapa'
import Tours from './pages/Tours'
import Autor from './pages/Autor'
import Contacto from './pages/Contacto'
import Historia from './pages/Historia'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/semana-santa" element={<SemanaSanta />} />
        <Route path="/festival-jazz" element={<FestivalJazz />} />
        <Route path="/que-ver" element={<QueVer />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/autor" element={<Autor />} />
        <Route path="/contacto" element={<Contacto />} />
      </Route>
    </Routes>
  )
}
