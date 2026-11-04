import { useRef, useState } from 'react'
import { useScroll } from 'framer-motion'
import { PROJECTS, SECTION, WORK } from '@/content'
import { Container, Section } from '@/components/layout/Section'
import { ArrowLink, MaskLines, SectionHead } from '@/components/primitives'
import ProjectCard from './ProjectCard'
import SeeAll from './SeeAll'
import './Work.css'

/**
 * Case study: titolo fisso a sinistra, card che si impilano al centro,
 * "Guarda tutti" fisso a destra per mostrare anche i progetti oltre i primi `WORK.featured`.
 */
export default function Work() {
  const [expanded, setExpanded] = useState(false)
  const projects = expanded ? PROJECTS : PROJECTS.slice(0, WORK.featured)
  const stackRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] })

  return (
    <Section id={SECTION.work} tone="light" className="work">
      <Container>
        <SectionHead label={WORK.label} meta={WORK.meta} />

        <div className="work__layout">
          <div className="work__side">
            <MaskLines as="h2" className="h2" lines={WORK.title} />
            <ArrowLink href={WORK.cta.href}>{WORK.cta.label}</ArrowLink>
          </div>

          <div className="work__stack" ref={stackRef}>
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} total={projects.length} progress={scrollYProgress} />
            ))}
          </div>

          {PROJECTS.length > WORK.featured && (
            <div className="work__aside">
              <SeeAll expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}
