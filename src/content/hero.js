import { SECTION, anchor } from './site'

export const HERO = {
  photo: {
    src: '/images/hero.webp',
    alt: 'Omar in piedi su una terrazza davanti al mare in tempesta',
  },
  /** Righe della frase: l'ultima resta più tenue. */
  tagline: ['Creative developer: progetto', 'e sviluppo esperienze digitali'],
  taglineMuted: 'su misura.',
  cta: { label: 'Scopri di più', href: anchor(SECTION.about) },
  services: ['Siti web creativi', 'App custom', 'Web app'],
}
