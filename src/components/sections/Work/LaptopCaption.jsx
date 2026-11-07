'use client'

import { AnimatePresence, m } from 'framer-motion'
import { WORK } from '@/content'
import { ArrowLink } from '@/components/primitives'
import { pad2 } from '@/lib/format'
import { EASE } from '@/lib/motion'

/** Sotto il portatile: numero, nome, tipo e descrizione del progetto in primo piano, e il link al sito se c'è. */
export default function LaptopCaption({ project, projects }) {
  return (
    <div className="laptop__caption" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {project && (
          <m.div
            key={project.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {/* il contatore sta fuori dal titolo: per motori e lettori di schermo il titolo è solo il progetto */}
            <div className="laptop__heading">
              <span className="laptop__count muted" aria-hidden="true">
                {pad2(projects.indexOf(project) + 1)} / {pad2(projects.length)}
              </span>
              <h3 className="laptop__title">
                {project.title} <span className="muted">· {project.tag}</span>
              </h3>
            </div>
            <p className="laptop__description muted">{project.description}</p>
            {project.href && (
              <ArrowLink href={project.href} target="_blank" rel="noreferrer">
                {WORK.visit}
              </ArrowLink>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
