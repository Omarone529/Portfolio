import localFont from 'next/font/local'

// File nel repo (src/app/fonts/, sottoinsieme latin da Fontsource, licenza OFL): la build non scarica nulla
// e funziona anche offline; chi visita li riceve dal sito stesso, nessuna richiesta a Google.

/** Tutti i testi del sito. */
export const poppins = localFont({
  src: [
    { path: './fonts/poppins-latin-300-normal.woff2', weight: '300', style: 'normal' },
    { path: './fonts/poppins-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/poppins-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/poppins-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
})
