import { m } from 'framer-motion'
import { PROJECTS, WORK } from '@/content'
import { RollText } from '@/components/primitives'
import { EASE, IN_VIEW } from '@/lib/motion'

/** Le card che spuntano dalla cartella: le prime tre, la prima in fondo e più in alto. */
const PEEK = PROJECTS.slice(0, 3)

/**
 * "Guarda tutti": una cartella blu con dentro alcune card dei progetti. In
 * hover il pannello davanti si apre un poco e le card salgono a ventaglio; il
 * clic apre la vista completa.
 */
export default function SeeAll({ onOpen, ref }) {
  return (
    <m.button
      ref={ref}
      type="button"
      className="folder"
      onClick={onOpen}
      aria-haspopup="dialog"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={IN_VIEW}
      transition={{ duration: 1, ease: EASE }}
    >
      <span className="folder__body" aria-hidden="true">
        <span className="folder__back" />
        {PEEK.map((project, i) => (
          <span
            key={project.title}
            className="folder__card"
            style={{ '--i': i - (PEEK.length - 1) / 2, '--depth': PEEK.length - 1 - i, background: project.tint }}
          >
            <img
              src={project.logo}
              alt=""
              width={project.logoSize[0]}
              height={project.logoSize[1]}
              loading="lazy"
              decoding="async"
            />
          </span>
        ))}
        <span className="folder__front" />
      </span>
      <span className="folder__label">
        <RollText>{`${WORK.seeAll} (${PROJECTS.length})`}</RollText>
      </span>
    </m.button>
  )
}
