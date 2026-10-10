import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, MotionConfig } from 'motion/react'
import Header from './Header'
import Footer from './Footer'
import EntryGate from './EntryGate'
import { useApp } from '../context/AppContext'
import { useSpotlight } from '../hooks/useSpotlight'

const TITLES: Record<string, { es: string; en: string }> = {
  '/': { es: 'Inicio', en: 'Home' },
  '/historia': { es: 'Historia', en: 'History' },
  '/eventos': { es: 'Eventos', en: 'Events' },
  '/semana-santa': { es: 'Semana Santa', en: 'Holy Week' },
  '/festival-jazz': { es: 'Festival de Jazz', en: 'Jazz Festival' },
  '/que-ver': { es: 'Qué ver', en: 'What to see' },
  '/mapa': { es: 'Mapa', en: 'Map' },
  '/tours': { es: 'Tours', en: 'Tours' },
  '/autor': { es: 'Autores', en: 'Authors' },
  '/contacto': { es: 'Contacto', en: 'Contact' },
  '/galeria': { es: 'Galería', en: 'Gallery' },
  '/como-llegar': { es: 'Cómo llegar', en: 'Getting here' },
  '/itinerarios': { es: 'Itinerarios', en: 'Itineraries' },
  '/sobre-nosotros': { es: 'Sobre nosotros', en: 'About us' },
}

export default function Layout() {
  const { hasChosenAudience, lang } = useApp()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useSpotlight()

  useEffect(() => {
    const entry = TITLES[pathname]
    const base = 'Santa Cruz de Mompox'
    document.title = entry ? `${entry[lang]} · ${base}` : base
  }, [pathname, lang])

  if (!hasChosenAudience) {
    return <EntryGate />
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={`app-shell${isHome ? ' app-shell--home' : ''}`}>
        <a className="skip-link" href="#contenido">
          {lang === 'en' ? 'Skip to content' : 'Saltar al contenido'}
        </a>
        <Header />
        <main className="app-main" id="contenido">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
