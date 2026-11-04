import 'lenis/dist/lenis.css'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/page.css'
import { SEO, SITE } from '@/content'
import Providers from '@/providers/Providers'
import { geist, inter } from './fonts'

export const metadata = {
  metadataBase: new URL(`${SITE.url}/`),
  title: SEO.title,
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
    <html lang={SITE.lang} className={`${geist.variable} ${inter.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
