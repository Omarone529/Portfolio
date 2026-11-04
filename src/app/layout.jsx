import 'lenis/dist/lenis.css'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/page.css'
import { SITE } from '@/content'
import Providers from '@/providers/Providers'
import { geist, inter } from './fonts'

export const metadata = {
  title: `${SITE.fullName}, ${SITE.role}`,
  description: 'Siti web creativi, applicazioni custom e web app su misura.',
}

export const viewport = {
  themeColor: '#111111',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${geist.variable} ${inter.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
