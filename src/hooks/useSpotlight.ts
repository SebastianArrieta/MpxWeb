import { useEffect } from 'react'

const SPOT_SELECTOR =
  '.quick-card, .home__event-card, .info-card, .contact-author-card, .timeline__cultural-card, .map-list__item'

/**
 * Efecto de luz que sigue al cursor sobre tarjetas.
 * Usa delegación de eventos: escribe --spot-x / --spot-y en el elemento activo.
 * Se desactiva en dispositivos táctiles o con reducción de movimiento.
 */
export function useSpotlight() {
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduced) return

    const onMove = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(SPOT_SELECTOR) as HTMLElement | null
      if (!target) return
      const rect = target.getBoundingClientRect()
      target.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
      target.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
}
