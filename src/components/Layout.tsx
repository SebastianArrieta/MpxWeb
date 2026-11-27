import { Outlet, useLocation } from 'react-router-dom'
import { motion, MotionConfig } from 'motion/react'
import Header from './Header'
import Footer from './Footer'
import { useApp } from '../context/AppContext'
import { useSpotlight } from '../hooks/useSpotlight'
import { useSeo } from '../hooks/useSeo'
import { stripLocale } from '../i18n/locale'

export default function Layout() {
  const { lang } = useApp()
  const pathname = stripLocale(useLocation().pathname)
  const isHome = pathname === '/'

  useSpotlight()

  useSeo(pathname, lang)

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
