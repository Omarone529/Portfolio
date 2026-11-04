import { SECTION, anchor } from './site'

/**
 * I case study. Un progetto con una demo registrata ha `video` e `poster`;
 * gli altri mostrano `logo` su un fondo `tint`, scalato di `logoScale`.
 * Un `href` esterno apre il sito pubblicato in una nuova scheda.
 */
export const PROJECTS = [
  {
    title: 'JoeDesign',
    tag: 'Sito portfolio',
    href: 'https://joesarchiolla.com/',
    video: '/projects/joedesign-demo.mp4',
    poster: '/projects/joedesign-demo.webp',
  },
  {
    title: 'Synapsi',
    tag: 'App desktop',
    video: '/projects/synapsi-demo.mp4',
    poster: '/projects/synapsi-demo.webp',
  },
  {
    title: 'MBM Meccanica',
    tag: 'Sito vetrina',
    video: '/projects/mbm-meccanica-demo.mp4',
    poster: '/projects/mbm-meccanica-demo.webp',
  },
  {
    title: 'ApexGPS',
    tag: 'Web app',
    logo: '/projects/apexgps-logo.webp',
    tint: '#EAF1F5',
  },
  {
    title: 'AskyVet',
    tag: 'Blog e forum',
    logo: '/projects/askyvet-logo.webp',
    tint: '#E9F8FF',
    logoScale: 0.55,
  },
  {
    title: 'Timesheet Manager',
    tag: 'App desktop e mobile',
    logo: '/projects/timesheet-manager-logo.webp',
    tint: '#E9F7FD',
    logoScale: 0.5,
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
}
