import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import EntryGate from './EntryGate'
import { useApp } from '../context/AppContext'

export default function Layout() {
  const { hasChosenAudience } = useApp()

  if (!hasChosenAudience) {
    return <EntryGate />
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
