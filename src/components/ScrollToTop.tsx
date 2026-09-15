import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const id = decodeURIComponent(hash.slice(1))
    let cancelled = false

    const scrollToHash = () => {
      if (cancelled) return
      const el = document.getElementById(id)
      if (el) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
        return
      }
      window.scrollTo(0, 0)
    }

    const frame = window.requestAnimationFrame(scrollToHash)
    const retry = window.setTimeout(scrollToHash, 80)

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(retry)
    }
  }, [pathname, hash])

  return null
}
