'use client'

import { PROJECTS, SECTION, WORK } from '@/content'
import { Container, Section } from '@/components/layout/Section'
import { SectionHead } from '@/components/primitives'
import Laptop from './Laptop'
import './Work.css'

/** Nel dock del portatile solo i progetti con una demo da mostrare; gli altri sono nel Finder. */
const FEATURED = PROJECTS.filter((p) => p.video)

/**
 * Case study: un portatile da esplorare al centro della sezione, con
 * un'app per progetto nel dock e tutti i progetti nella cartella sulla scrivania.
 */
export default function Work() {
  return (
    <Section id={SECTION.work} tone="light" className="work">
      <Container>
        <SectionHead label={WORK.head} />
        <div className="work__layout">
          <Laptop projects={FEATURED} />
        </div>
      </Container>
    </Section>
  )
}
