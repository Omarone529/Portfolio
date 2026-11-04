import { m } from 'framer-motion'

/**
 * Contenitore di un progetto: un link che apre il sito pubblicato in una nuova
 * scheda se il progetto ne ha uno, altrimenti un semplice blocco.
 */
export default function ProjectLink({ project, className, style, children }) {
  if (!project.href) {
    return (
      <m.div className={className} style={style}>
        {children}
      </m.div>
    )
  }
  return (
    <m.a className={className} style={style} href={project.href} target="_blank" rel="noreferrer">
      {children}
    </m.a>
  )
}
