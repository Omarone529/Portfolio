import { SEO, SITE } from '@/content'

// l'export statico scrive manifest.webmanifest solo se la route è dichiarata statica
export const dynamic = 'force-static'

/** Nome, colori e icone usati quando il sito viene aggiunto alla schermata Home. */
export default function manifest() {
  return {
    name: `${SITE.fullName}, ${SITE.role}`,
    short_name: SITE.fullName,
    description: SEO.description,
    lang: SITE.lang,
    start_url: '/',
    display: 'browser',
    background_color: '#111111',
    theme_color: '#111111',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  }
}
