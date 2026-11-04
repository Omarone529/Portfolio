import { COOKIES, PRIVACY, PROJECTS } from '@/content'
import { absoluteUrl } from '@/lib/seo'

// l'export statico scrive sitemap.xml solo se la route è dichiarata statica
export const dynamic = 'force-static'

/** La home con le immagini che contiene (così finiscono anche nella ricerca immagini), poi le pagine legali. */
export default function sitemap() {
  return [
    {
      url: absoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      images: [absoluteUrl('/images/hero.webp'), ...PROJECTS.map((p) => absoluteUrl(p.poster ?? p.logo))],
    },
    ...[PRIVACY, COOKIES].map((doc) => ({
      url: absoluteUrl(doc.path),
      lastModified: new Date(doc.updated),
      changeFrequency: 'yearly',
      priority: 0.2,
    })),
  ]
}
