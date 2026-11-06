import { PLACE, SITE } from './site'

/**
 * Testi per motori di ricerca, anteprime dei link e assistenti AI.
 * Il titolo sta sotto i 60 caratteri e la descrizione sotto i 160, le soglie
 * oltre le quali i risultati di ricerca li tagliano.
 */
export const SEO = {
  title: `${SITE.fullName} · ${SITE.role} a ${PLACE.city}`,
  description: `${SITE.fullName}, full stack developer a ${PLACE.city}: siti web creativi, applicazioni custom e web app su misura, con animazioni curate e codice veloce.`,
  /** Chi è, in terza persona: è la frase che motori e assistenti AI possono citare così com'è. */
  summary: `${SITE.fullName} è un full stack developer con base a ${PLACE.city}, in ${PLACE.region}. Progetta e sviluppa siti web creativi, applicazioni custom e web app su misura, curando insieme design, animazioni e codice.`,
  keywords: [
    'full stack developer',
    'sviluppatore full stack',
    'sviluppatore web',
    'siti web creativi',
    'applicazioni custom',
    'web app',
    'React',
    'Next.js',
    PLACE.city,
    PLACE.nearby,
  ],
}
