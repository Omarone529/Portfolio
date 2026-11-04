import { motion, useTransform } from 'framer-motion'
import { SECTION, anchor } from '@/content'
import { EASE } from '@/lib/motion'
import ProjectMedia from './ProjectMedia'

/** Ogni card resta un po' più in basso della precedente e si rimpicciolisce man mano che arrivano le successive. */
const STICKY_TOP = 50
const STICKY_STEP = 40
const SCALE_STEP = 0.05

/**
 * Card di un progetto nella pila. `progress` è l'avanzamento dello scroll lungo
 * tutta la pila (0..1): la card `index` comincia a ridursi quando la pila ha
 * raggiunto il suo turno.
 */
export default function ProjectCard({ project, index, total, progress }) {
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * SCALE_STEP])
  const external = project.href?.startsWith('http')

  return (
    <motion.a
      href={project.href ?? anchor(SECTION.work)}
      className="card"
      style={{ scale, top: STICKY_TOP + index * STICKY_STEP }}
      {...(external && { target: '_blank', rel: 'noreferrer' })}
    >
      <motion.div
        className="card__media"
        style={project.tint && { background: project.tint }}
        initial={{ clipPath: 'inset(12% 8% 12% 8%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <ProjectMedia project={project} />
      </motion.div>
      <div className="card__meta">
        <p>{project.title}</p>
        <p className="muted">{project.tag}</p>
      </div>
    </motion.a>
  )
}
