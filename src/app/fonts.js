import { Geist, Inter } from 'next/font/google'

// Scaricati e serviti dal sito stesso durante la build: nessuna richiesta a Google da chi visita.

/** Testo di tutto il sito. */
export const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-geist',
  display: 'swap',
})

/** Il logo e il nome grande del footer. */
export const inter = Inter({
  subsets: ['latin'],
  weight: ['800', '900'],
  variable: '--font-inter',
  display: 'swap',
})
