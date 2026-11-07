'use client'

import { PROJECTS, SECTION, WORK } from '@/content'
import { Container, Section } from '@/components/layout/Section'
import { MaskLines, SectionHead } from '@/components/primitives'
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
        <SectionHead label={WORK.label} meta={WORK.meta} />

        <div className="work__layout">
          <div className="work__side">
            {/* ripete visivamente il titolo della sezione, che è già l'h2 dell'intestazione */}
            <MaskLines as="p" className="h2" lines={WORK.title} aria-hidden />
          </div>

          <Laptop projects={FEATURED} />
        </div>
      </Container>
    </Section>
  )
}
