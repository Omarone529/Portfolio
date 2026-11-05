import { useEffect } from 'react'
import { m } from 'framer-motion'
import { PROJECTS, WORK } from '@/content'
import { Portal } from '@/components/layout/Portal'
import { RollText } from '@/components/primitives'
import { EASE } from '@/lib/motion'
import { ProjectDemo } from './ProjectMedia'
import ProjectLink from './ProjectLink'

/**
 * Vista "Guarda tutti": pannello a tutto schermo che sale dal basso con tutti i
 * progetti e le loro demo. Scorre per conto suo (data-lenis-prevent) mentre la
 * pagina sotto resta ferma; si chiude con "Mostra meno" o con Esc.
 * Va montato dentro <AnimatePresence> per l'animazione di chiusura.
 */
export default function AllProjects({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <Portal>
      <m.div
        className="all-projects tone-light"
        role="dialog"
        aria-modal="true"
        aria-label={WORK.allTitle}
        data-lenis-prevent
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={{ clipPath: 'inset(0% 0 0 0)' }}
        exit={{ clipPath: 'inset(0 0 100% 0)' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <header className="all-projects__head">
          <p>
            {WORK.allTitle} <span className="muted">({PROJECTS.length})</span>
          </p>
          <button type="button" className="all-projects__close" onClick={onClose} autoFocus>
            <RollText>{WORK.showLess}</RollText>
          </button>
        </header>

        <ul className="all-projects__grid">
          {PROJECTS.map((project, i) => (
            <m.li
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.35 + i * 0.08 }}
            >
              <ProjectLink project={project} className="tile">
                <div className="tile__media" style={{ background: project.tint }}>
                  <ProjectDemo project={project} />
                </div>
                <div className="card__meta">
                  <p>{project.title}</p>
                  <p className="muted">{project.tag}</p>
                </div>
                <p className="tile__description muted">{project.description}</p>
              </ProjectLink>
            </m.li>
          ))}
        </ul>
      </m.div>
    </Portal>
  )
}
