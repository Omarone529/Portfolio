'use client'

import { PROJECTS, SECTION, WORK } from '@/content'
import { Container, Section } from '@/components/layout/Section'
import { MaskLines } from '@/components/primitives'
import Laptop from './Laptop'
import './Work.css'

/** Nel dock del portatile solo i progetti con una demo da mostrare; gli altri sono nel Finder. */
const FEATURED = PROJECTS.filter((p) => p.video)

/**
 * Case study: a sinistra il titolo, a destra un portatile da esplorare, con
 * un'app per progetto nel dock e tutti i progetti nella cartella sulla scrivania.
 */
export default function Work() {
  return (
    <Section id={SECTION.work} tone="light" className="work">
      <Container>
        <div className="work__layout">
          <div className="work__side">
            {/* è il titolo h2 della sezione; l'etichetta dà ai lettori di schermo le due parole separate */}
            <MaskLines as="h2" className="h2" lines={WORK.title} aria-label={WORK.label} />
          </div>

          <Laptop projects={FEATURED} />
        </div>
      </Container>
    </Section>
  )
}
