import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import EntryGate from './EntryGate'
import { useApp } from '../context/AppContext'

export default function Layout() {
  const { hasChosenAudience } = useApp()
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  if (!hasChosenAudience) {
    return <EntryGate />
  }

  return (
    <div className={`app-shell${isHome ? ' app-shell--home' : ''}`}>
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
