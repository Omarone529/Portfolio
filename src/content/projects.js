import { SECTION, anchor } from './site'

/**
 * I case study. Ogni progetto ha una `description` di una frase (mostrata nella
 * vista "Guarda tutti" e nei dati strutturati), `logo` su un fondo `tint` (scalato di
 * `logoScale`), che è ciò che mostra la pila. Chi ha una demo registrata ha
 * anche `video` e `poster`, mostrati nella vista "Guarda tutti".
 * Un `href` esterno apre il sito pubblicato in una nuova scheda.
 */
export const PROJECTS = [
  {
    title: 'JoeDesign',
    tag: 'Sito portfolio',
    description: 'Sito portfolio per un product designer, con archivio dei lavori e una pagina per ogni progetto.',
    href: 'https://joesarchiolla.com/',
    logo: '/projects/joedesign-logo.webp',
    tint: '#E9E7E3',
    logoScale: 0.36,
    video: '/projects/joedesign-demo.mp4',
    poster: '/projects/joedesign-demo.webp',
  },
  {
    title: 'Synapsi',
    tag: 'App desktop',
    description: 'Gestionale per freelance con assistente AI su Telegram, dalla fatturazione elettronica al bilancio.',
    logo: '/projects/synapsi-logo.webp',
    tint: '#FBF0EA',
    logoScale: 0.45,
    video: '/projects/synapsi-demo.mp4',
    poster: '/projects/synapsi-demo.webp',
  },
  {
    title: 'MBM Meccanica',
    tag: 'Sito vetrina',
    description: "Sito vetrina per un'officina metalmeccanica: servizi, lavorazioni e parco macchine.",
    logo: '/projects/mbm-meccanica-logo.webp',
    tint: '#ECEEF8',
    video: '/projects/mbm-meccanica-demo.mp4',
    poster: '/projects/mbm-meccanica-demo.webp',
  },
  {
    title: 'ApexGPS',
    tag: 'Web app',
    description: 'Pianificatore di percorsi panoramici per motociclisti, con mappa e tracciati sincronizzati.',
    logo: '/projects/apexgps-logo.webp',
    tint: '#EAF1F5',
  },
]

export const WORK = {
  label: 'Case study',
  meta: '2025 — 2026',
  title: ['Case', 'study'],
  cta: { label: 'Lavoriamo insieme', href: anchor(SECTION.contact) },
  /** Quanti progetti mostra la pila prima di "Guarda tutti". */
  featured: 4,
  seeAll: 'Guarda tutti',
  showLess: 'Mostra meno',
  allTitle: 'Tutti i progetti',
}
