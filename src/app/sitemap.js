import { PROJECTS } from '@/content'
import { absoluteUrl } from '@/lib/seo'

// l'export statico scrive sitemap.xml solo se la route è dichiarata statica
export const dynamic = 'force-static'

/** Una sola pagina, con le immagini e le demo che contiene, così finiscono anche nella ricerca immagini e video. */
export default function sitemap() {
  return [
    {
      url: absoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      images: [absoluteUrl('/images/hero.webp'), ...PROJECTS.map((p) => absoluteUrl(p.poster ?? p.logo))],
    },
  ]
}
