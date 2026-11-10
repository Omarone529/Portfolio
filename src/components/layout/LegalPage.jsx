import { LEGAL_UI } from '@/content'
import { ArrowLink } from '@/components/primitives'
import { Logo } from './Logo'
import './legal.css'

const DATE = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })

/**
 * Pagina di un documento legale (informativa privacy, cookie policy): titolo,
 * data di ultimo aggiornamento e sezioni numerate nell'ordine in cui sono scritte.
 * È testo da leggere, quindi niente animazioni d'ingresso.
 */
export function LegalPage({ doc }) {
  return (
    <main className="legal tone-light">
      <header className="legal__head">
        <Logo />
      </header>

      <article className="legal__doc">
        <h1 className="h2">{doc.title}</h1>
        <p className="legal__updated muted">
          {LEGAL_UI.updatedLabel}: <time dateTime={doc.updated}>{DATE.format(new Date(doc.updated))}</time>
        </p>
        <p className="legal__intro">{doc.intro}</p>

        <ol className="legal__sections">
          {doc.sections.map((section, i) => (
            <li key={section.heading}>
              <h2 className="legal__heading">
                <span className="muted">{i + 1}.</span> {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.link && (
                <a
                  className="legal__link"
                  href={section.link.href}
                  {...(section.link.href.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
                >
                  {section.link.label}
                </a>
              )}
            </li>
          ))}
        </ol>

        <ArrowLink href="/">{LEGAL_UI.back}</ArrowLink>
      </article>
    </main>
  )
}
