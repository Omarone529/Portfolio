import { SECTION, anchor } from './site'

export const HERO = {
  photo: {
    src: '/images/omar-bayadi-full-stack-developer.webp',
    size: [1920, 1080],
    alt: 'Omar in piedi su un belvedere sopra il mare, sotto un cielo in tempesta',
  },
  /** Righe della frase: l'ultima entra più tenue e poi si accende. */
  tagline: ['Full stack developer: progetto', 'e sviluppo esperienze digitali'],
  taglineMuted: 'su misura.',
  cta: { label: 'Scopri di più', href: anchor(SECTION.about) },
  services: ['Siti web creativi', 'App custom', 'Web app'],
}
