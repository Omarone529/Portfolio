'use client'

import { useCallback, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { PROJECTS, SECTION, WORK } from '@/content'
import { Container, Section } from '@/components/layout/Section'
import { MaskLines, SectionHead } from '@/components/primitives'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import AllProjects from './AllProjects'
import Laptop from './Laptop'
import SeeAll from './SeeAll'
import './Work.css'

const FEATURED = PROJECTS.slice(0, WORK.featured)

/**
 * Case study: a sinistra il titolo e la cartella "Guarda tutti"; a destra un
 * portatile da esplorare, con un'app per progetto nel dock.
 */
export default function Work() {
  const [allOpen, setAllOpen] = useState(false)
  const seeAllRef = useRef(null)
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
            <SeeAll ref={seeAllRef} onOpen={openAll} />
          </div>

          <Laptop projects={FEATURED} />
        </div>
      </Container>

      <AnimatePresence>{allOpen && <AllProjects onClose={closeAll} />}</AnimatePresence>
    </Section>
  )
}
