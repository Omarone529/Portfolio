/**
 * I case study. Ogni progetto ha una `description` di una frase (mostrata nella
 * vista "Guarda tutti" e nei dati strutturati), `logo` su un fondo `tint` (scalato di
 * `logoScale`), che è ciò che mostra la pila. Chi ha una demo registrata ha
 * anche `video` e `poster`, mostrati nella vista "Guarda tutti".
 * Un `href` esterno apre il sito pubblicato in una nuova scheda. `logoSize` e
 * `DEMO_SIZE` sono le misure reali dei file, che il browser usa per riservare
 * lo spazio prima che arrivino (i test controllano che coincidano).
 */
/** Misure delle demo registrate e dei loro poster: sono tutte 1280×720. */
export const DEMO_SIZE = [1280, 720]

export const PROJECTS = [
  {
    title: 'JoeDesign',
    tag: 'Sito portfolio',
    description: 'Sito portfolio per un product designer, con archivio dei lavori e una pagina per ogni progetto.',
    href: 'https://joesarchiolla.com/',
    logo: '/projects/joedesign-logo.webp',
    logoSize: [512, 512],
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
    logoSize: [340, 302],
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
    logoSize: [800, 265],
    tint: '#ECEEF8',
    video: '/projects/mbm-meccanica-demo.mp4',
    poster: '/projects/mbm-meccanica-demo.webp',
  },
  {
    title: 'ApexGPS',
    tag: 'Web app',
    description: 'Pianificatore di percorsi panoramici per motociclisti, con mappa e tracciati sincronizzati.',
    logo: '/projects/apexgps-logo.webp',
    logoSize: [800, 234],
    tint: '#EAF1F5',
  },
]

export const WORK = {
  label: 'Case study',
  meta: '2025 · 2026',
  title: ['Case', 'study'],
  /** Quanti progetti mostra la pila prima di "Guarda tutti". */
  featured: 4,
  visit: 'Visita il sito',
  /** Testi del portatile: il suggerimento sopra il dock e il desktop senza finestre aperte. */
  hint: "Clicca un'app per aprirla",
  emptyTitle: 'Scegli un progetto',
  emptyText: "Apri un'app dal dock per vedere la demo.",
  switcher: 'Scegli il progetto',
  fullscreen: 'Apri a schermo intero',
  exitFullscreen: 'Esci dallo schermo intero',
  windowClose: 'Chiudi',
  windowMinimize: 'Riduci nel dock',
  windowMaximize: 'Ingrandisci',
  windowResize: 'Ridimensiona',
  seeAll: 'Guarda tutti',
  showLess: 'Mostra meno',
  allTitle: 'Tutti i progetti',
}
