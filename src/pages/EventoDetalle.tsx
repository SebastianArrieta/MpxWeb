import FestijazzExperience from '../components/FestijazzExperience'
import SemanaSantaExperience from '../components/SemanaSantaExperience'

export default function EventoDetalle({ tipo }: { tipo: 'semanaSanta' | 'festivalJazz' }) {
  if (tipo === 'festivalJazz') {
    return <FestijazzExperience />
  }

  return <SemanaSantaExperience />
}
