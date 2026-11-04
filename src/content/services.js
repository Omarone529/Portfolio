export const SERVICES = [
  {
    title: 'Siti web creativi',
    kicker: 'Design & Motion',
    text: 'Siti su misura con animazioni, transizioni e interazioni curate al dettaglio. Ogni pagina racconta il tuo progetto in modo unico, veloce e pensato per farsi ricordare.',
    image: '/projects/joedesign-demo.webp',
  },
  {
    title: 'Applicazioni custom',
    kicker: 'Software su misura',
    text: 'Strumenti costruiti attorno al tuo flusso di lavoro: gestionali, dashboard e integrazioni che automatizzano i processi e ti fanno risparmiare tempo ogni giorno.',
    image: '/projects/synapsi-demo.webp',
  },
  {
    title: 'Web app',
    kicker: 'Prodotti digitali',
    text: 'Applicazioni web scalabili, dal prototipo al lancio. Interfacce chiare, architettura solida e performance alte, su qualsiasi dispositivo.',
    image: '/projects/apexgps-logo.webp',
    tint: '#EAF1F5',
  },
]

export const SERVICES_INTRO = {
  label: 'Servizi',
  meta: SERVICES.map((s) => s.title).join(' · '),
  statement:
    "Dal primo schizzo al rilascio: progetto l'interfaccia, scrivo il codice e curo ogni animazione, un dettaglio alla volta.",
  /** Quante parole finali della frase restano più tenui. */
  mutedTail: 4,
  image: { src: '/images/hero-sm.webp', alt: '' },
}
