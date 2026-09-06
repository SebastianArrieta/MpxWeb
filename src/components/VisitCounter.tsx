import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'

export default function VisitCounter({ className = '' }: { className?: string }) {
  const { visitCount, labels } = useApp()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setShown(visitCount)
      return
    }
    let raf = 0
    const start = performance.now()
    const duration = 900
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setShown(Math.round(visitCount * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visitCount])

  return (
    <span className={`visit-counter ${className}`.trim()} title={labels.shell.contadorTitle}>
      {labels.shell.contadorVisitas}: <strong>{shown.toLocaleString('es-CO')}</strong>
    </span>
  )
}