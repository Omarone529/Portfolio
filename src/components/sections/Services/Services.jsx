import { SECTION, SERVICES, SERVICES_INTRO } from '@/content'
import { Container, Section } from '@/components/layout/Section'
import { ScrollWords, SectionHead } from '@/components/primitives'
import ServiceRow from './ServiceRow'
import './Services.css'

/** Servizi, su fondo scuro: frase d'apertura, poi una riga per servizio. */
export default function Services() {
  const intro = SERVICES_INTRO
  return (
    <Section id={SECTION.services} tone="dark" edge className="services">
      <Container>
        <SectionHead label={intro.label} meta={intro.meta} />

        <div className="services__intro">
          <ScrollWords className="statement services__statement" text={intro.statement} />
        </div>

        <ol className="services__list">
          {SERVICES.map((service, i) => (
            <ServiceRow key={service.title} service={service} index={i} />
          ))}
        </ol>
      </Container>
    </Section>
  )
}
