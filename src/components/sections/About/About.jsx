import { ABOUT, SECTION } from '@/content'
import { Container, Section } from '@/components/layout/Section'
import { ArrowLink, FadeUp, MaskLines, RevealImage, ScrollWords, SectionHead } from '@/components/primitives'
import Marquee from './Marquee'
import Stats from './Stats'
import './About.css'

/** Chi sono: frase grande, ritratto, come lavoro e i numeri, poi la fascia delle tecnologie. */
export default function About() {
  const { results } = ABOUT
  return (
    <Section id={SECTION.about} tone="light" edge className="about">
      <Container>
        <SectionHead label={ABOUT.label} meta={ABOUT.meta} />
        <ScrollWords className="statement about__statement" text={ABOUT.statement} />

        <div className="about__grid">
          <RevealImage className="about__portrait" src={ABOUT.portrait.src} alt={ABOUT.portrait.alt} />

          <div className="about__rows">
            {ABOUT.rows.map((row) => (
              <div className="about-row" key={row.label}>
                <MaskLines as="p" lines={[row.label]} />
                <FadeUp as="p" className="muted">
                  {row.text}
                </FadeUp>
              </div>
            ))}
            <div className="about-row">
              <MaskLines as="p" lines={[results.label]} />
              <div className="about-row__body">
                <Stats items={results.stats} />
                <ArrowLink href={results.cta.href}>{results.cta.label}</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Marquee />
    </Section>
  )
}
