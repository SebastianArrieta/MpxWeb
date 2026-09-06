import { useApp } from '../context/AppContext'

export default function VisitCounter({ className = '' }: { className?: string }) {
  const { visitCount } = useApp()
  return (
    <span className={`visit-counter ${className}`.trim()} title="Contador de visitas (stub)">
      Visitas: <strong>{visitCount}</strong>
    </span>
  )
}
