'use client'

import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, useScroll } from 'framer-motion'
import { PROJECTS, SECTION, WORK } from '@/content'
import { Container, Section } from '@/components/layout/Section'
import { ArrowLink, MaskLines, SectionHead } from '@/components/primitives'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import AllProjects from './AllProjects'
import ProjectCard from './ProjectCard'
import SeeAll from './SeeAll'
import './Work.css'

const FEATURED = PROJECTS.slice(0, WORK.featured)

/**
 * Case study: titolo fisso a sinistra, card con i loghi che si impilano al
 * centro, "Guarda tutti" fisso a destra che apre tutti i progetti con le demo.
 */
export default function Work() {
  const [allOpen, setAllOpen] = useState(false)
  const seeAllRef = useRef(null)
  const stackRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] })
  const { lock, unlock } = useSmoothScroll()

  const openAll = () => {
    lock()
    setAllOpen(true)
  }
  const closeAll = useCallback(() => {
    unlock()
    setAllOpen(false)
    seeAllRef.current?.focus({ preventScroll: true })
  }, [unlock])

  return (
    <Section id={SECTION.work} tone="light" className="work">
      <Container>
        <SectionHead label={WORK.label} meta={WORK.meta} />

        <div className="work__layout">
          <div className="work__side">
            {/* ripete visivamente il titolo della sezione, che è già l'h2 dell'intestazione */}
            <MaskLines as="p" className="h2" lines={WORK.title} aria-hidden />
            <ArrowLink href={WORK.cta.href}>{WORK.cta.label}</ArrowLink>
          </div>

          <div className="work__stack" ref={stackRef}>
            {FEATURED.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i}
                total={FEATURED.length}
                progress={scrollYProgress}
              />
            ))}
          </div>

          <div className="work__aside">
            <SeeAll ref={seeAllRef} onOpen={openAll} />
          </div>
        </div>
      </Container>

      <AnimatePresence>{allOpen && <AllProjects onClose={closeAll} />}</AnimatePresence>
    </Section>
  )
}
