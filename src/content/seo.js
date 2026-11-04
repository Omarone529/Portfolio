import { PLACE, SITE } from './site'

/**
 * Testi per motori di ricerca, anteprime dei link e assistenti AI.
 * Il titolo sta sotto i 60 caratteri e la descrizione sotto i 160, le soglie
 * oltre le quali i risultati di ricerca li tagliano.
 */
export const SEO = {
  title: `${SITE.fullName} · ${SITE.role} a ${PLACE.city}`,
  description: `${SITE.fullName}, creative developer a ${PLACE.city}: siti web creativi, applicazioni custom e web app su misura, con animazioni curate e codice veloce.`,
  keywords: [
    'creative developer',
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
