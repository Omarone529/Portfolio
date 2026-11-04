import { SECTION, SERVICES, SERVICES_INTRO } from '@/content'
import { Container, Section } from '@/components/layout/Section'
import { ArrowLink, RevealImage, ScrollWords, SectionHead } from '@/components/primitives'
import ServiceRow from './ServiceRow'
import './Services.css'

/** Servizi, su fondo scuro: frase d'apertura con immagine, poi una riga per servizio. */
export default function Services() {
  const intro = SERVICES_INTRO
  return (
    <Section id={SECTION.services} tone="dark" edge className="services">
      <Container>
        <SectionHead label={intro.label} meta={intro.meta} />

        <div className="services__intro">
          <RevealImage className="services__intro-img" src={intro.image.src} alt={intro.image.alt} />
          <ScrollWords className="statement services__statement" text={intro.statement} mutedTail={intro.mutedTail} />
        </div>
        <ArrowLink href={intro.cta.href}>{intro.cta.label}</ArrowLink>

        <ol className="services__list">
          {SERVICES.map((service, i) => (
            <ServiceRow key={service.title} service={service} index={i} />
          ))}
        </ol>
      </Container>
    </Section>
  )
}
