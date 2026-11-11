import 'lenis/dist/lenis.css'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/page.css'
import { SEO, SITE } from '@/content'
import Providers from '@/providers/Providers'
import { poppins } from './fonts'

const NO_SCRIPT_CSS = `.page *, .footer * { opacity: 1 !important; transform: none !important; clip-path: none !important; }
.edge { display: none !important; }
.footer--pending { visibility: visible !important; }`

/**
 * Altezza dello schermo intero, scritta prima del primo disegno: la foto della hero si misura su questa
 * e non sulla finestra, che sui telefoni cambia altezza quando la barra del browser compare o sparisce.
 */
const SCREEN_HEIGHT_JS = `document.documentElement.style.setProperty('--screen-h', Math.max(screen.width, screen.height) + 'px')`

export const metadata = {
  metadataBase: new URL(`${SITE.url}/`),
  // le altre pagine danno solo il proprio titolo, il nome lo aggiunge il modello
  title: { default: SEO.title, template: `%s · ${SITE.fullName}` },
  description: SEO.description,
  applicationName: SITE.fullName,
  authors: [{ name: SITE.fullName, url: SITE.url }],
  creator: SITE.fullName,
  publisher: SITE.fullName,
  keywords: SEO.keywords,
  category: 'technology',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    locale: SITE.locale,
    url: '/',
    siteName: SITE.fullName,
    title: SEO.title,
    description: SEO.description,
    firstName: 'Omar',
    lastName: 'Bayadi',
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.title,
    description: SEO.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // senza questo Safari su iPhone trasforma in link i numeri che sembrano telefoni
  formatDetection: { telephone: false, address: false, email: false },
}

export const viewport = {
  themeColor: '#111111',
  colorScheme: 'light',
}

export default function RootLayout({ children }) {
  return (
    // lo script qui sotto aggiunge uno stile a <html> prima che React si agganci: la differenza è voluta
    <html lang={SITE.lang} className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCREEN_HEIGHT_JS }} />
        {/* senza JavaScript le animazioni non partono: tutto ciò che entra animato resta visibile */}
        <noscript>
          <style>{NO_SCRIPT_CSS}</style>
        </noscript>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
