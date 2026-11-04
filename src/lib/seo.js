import { PLACE, PROFILES, PROJECTS, SEO, SERVICES, SITE, SKILLS } from '@/content'

/** URL assoluto di un percorso del sito ("/" → "https://omarbayadi.com/"). */
export function absoluteUrl(path = '/') {
  return new URL(path, `${SITE.url}/`).href
}

// Un solo nome per la persona, il sito e la pagina: ogni blocco li richiama per @id,
// così motori e AI capiscono che parlano della stessa entità.
const ID = {
  person: absoluteUrl('/#person'),
  website: absoluteUrl('/#website'),
  page: absoluteUrl('/#webpage'),
  work: absoluteUrl('/#work'),
}

/**
 * Dati strutturati della home (schema.org, un unico @graph): chi sono, il sito,
 * la pagina profilo, i servizi offerti e i progetti. Derivano dagli stessi
 * contenuti che la pagina mostra, quindi non possono contraddirla.
 */
export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': ID.person,
        name: SITE.fullName,
        jobTitle: SITE.role,
        description: SEO.description,
        url: absoluteUrl('/'),
        image: absoluteUrl('/images/hero.webp'),
        email: `mailto:${SITE.email}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: PLACE.city,
          addressRegion: PLACE.region,
          addressCountry: PLACE.country,
        },
        knowsAbout: SKILLS,
        knowsLanguage: ['it'],
        sameAs: PROFILES.map((p) => p.href),
        makesOffer: SERVICES.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.title,
            description: service.text,
            provider: { '@id': ID.person },
            areaServed: { '@type': 'Country', name: 'Italia' },
          },
        })),
      },
      {
        '@type': 'WebSite',
        '@id': ID.website,
        url: absoluteUrl('/'),
        name: SITE.fullName,
        description: SEO.description,
        inLanguage: 'it-IT',
        publisher: { '@id': ID.person },
      },
      {
        '@type': 'ProfilePage',
        '@id': ID.page,
        url: absoluteUrl('/'),
        name: SEO.title,
        description: SEO.description,
        inLanguage: 'it-IT',
        isPartOf: { '@id': ID.website },
        mainEntity: { '@id': ID.person },
        primaryImageOfPage: absoluteUrl('/images/hero.webp'),
        hasPart: { '@id': ID.work },
      },
      {
        '@type': 'ItemList',
        '@id': ID.work,
        name: 'Case study',
        itemListElement: PROJECTS.map((project, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'CreativeWork',
            name: project.title,
            genre: project.tag,
            description: project.description,
            image: absoluteUrl(project.poster ?? project.logo),
            creator: { '@id': ID.person },
            ...(project.href && { url: project.href }),
          },
        })),
      },
    ],
  }
}

// U+2028 e U+2029: validi nel JSON ma terminatori di riga per JavaScript
const LINE_SEPARATORS = new RegExp('[\\u2028\\u2029]', 'g')

/**
 * JSON da mettere dentro <script type="application/ld+json">. JSON.stringify da
 * solo non basta: un "</script>" in un testo chiuderebbe il tag e aprirebbe la
 * porta a un'iniezione, quindi i caratteri che l'HTML interpreta diventano escape.
 */
export function serializeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(LINE_SEPARATORS, (c) => `\\u${c.charCodeAt(0).toString(16)}`)
}
