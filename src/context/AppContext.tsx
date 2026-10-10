import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import esLabels from '../../content/es/labels.json'
import enLabels from '../../content/en/labels.json'

export type Audience = 'visitante' | 'momposino'
export type Lang = 'es' | 'en'
export type ContentLabels = typeof esLabels

const AUDIENCE_KEY = 'mpx-audience'
const LANG_KEY = 'mpx-lang'

const LABELS_BY_LANG: Record<Lang, ContentLabels> = { es: esLabels, en: enLabels }

interface AppContextValue {
  audience: Audience | null
  setAudience: (a: Audience) => void
  resetAudience: () => void
  lang: Lang
  toggleLang: () => void
  hasChosenAudience: boolean
  visitCount: number
  labels: ContentLabels
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceState] = useState<Audience | null>(() => {
    const stored = localStorage.getItem(AUDIENCE_KEY)
    if (stored === 'visitante' || stored === 'momposino') return stored
    return null
  })
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem(LANG_KEY)
    return stored === 'en' ? 'en' : 'es'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang)
    document.documentElement.setAttribute('lang', lang)
  }, [lang])

  useEffect(() => {
    if (audience) {
      document.documentElement.setAttribute('data-audience', audience)
    } else {
      document.documentElement.removeAttribute('data-audience')
    }
  }, [audience])

  const setAudience = useCallback((a: Audience) => {
    localStorage.setItem(AUDIENCE_KEY, a)
    setAudienceState(a)
  }, [])

  const resetAudience = useCallback(() => {
    localStorage.removeItem(AUDIENCE_KEY)
    setAudienceState(null)
  }, [])

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'es' ? 'en' : 'es'
      localStorage.setItem(LANG_KEY, next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      audience,
      setAudience,
      resetAudience,
      lang,
      toggleLang,
      hasChosenAudience: audience !== null,
      visitCount: 0,
      labels: LABELS_BY_LANG[lang],
    }),
    [audience, setAudience, resetAudience, lang, toggleLang],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}