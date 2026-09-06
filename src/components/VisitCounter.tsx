import { useApp } from '../context/AppContext'

export default function VisitCounter({ className = '' }: { className?: string }) {
  const { visitCount, labels } = useApp()
  return (
    <span className={`visit-counter ${className}`.trim()} title={labels.shell.contadorTitle}>
      {labels.shell.contadorVisitas}: <strong>{visitCount}</strong>
    </span>
  )
}