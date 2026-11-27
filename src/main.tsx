import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import App from './App'
import 'maplibre-gl/dist/maplibre-gl.css'
import './styles/tokens.css'
import './styles/index.css'
import './styles/mompox.css'
import './styles/chrome.css'
import './styles/home-editorial.css'
import './styles/pages-polish.css'
import './styles/historia-rio.css'
import './styles/festijazz.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* basename: permite publicar en una subcarpeta (p. ej. GitHub Pages: /MpxWeb/). */}
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/+$/, '') || undefined}>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
