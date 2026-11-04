import { motion, useTransform } from 'framer-motion'
import { EASE, IN_VIEW } from '@/lib/motion'
import { ProjectLogo } from './ProjectMedia'
import ProjectLink from './ProjectLink'

/** Ogni card resta un po' più in basso della precedente e si rimpicciolisce man mano che arrivano le successive. */
const STICKY_TOP = 50
const STICKY_STEP = 40
const SCALE_STEP = 0.05

/**
 * Card di un progetto nella pila: il logo sul suo fondo, titolo e tipo.
 * `progress` è l'avanzamento dello scroll lungo tutta la pila (0..1): la card
 * `index` comincia a ridursi quando la pila ha raggiunto il suo turno.
 */
export default function ProjectCard({ project, index, total, progress }) {
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * SCALE_STEP])

  return (
    <ProjectLink project={project} className="card" style={{ scale, top: STICKY_TOP + index * STICKY_STEP }}>
      <motion.div
        className="card__media"
        style={{ background: project.tint }}
        initial={{ clipPath: 'inset(12% 8% 12% 8%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ ...IN_VIEW, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <ProjectLogo project={project} />
      </motion.div>
      <div className="card__meta">
        <p>{project.title}</p>
        <p className="muted">{project.tag}</p>
      </div>
    </ProjectLink>
  )
}
