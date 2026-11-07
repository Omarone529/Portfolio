import { SECTION, anchor } from './site'

export const ABOUT = {
  label: 'About',
  statement:
    'Sono Omar, sviluppatore full stack. Progetto e realizzo siti web creativi, applicazioni e web app su misura, mettendo al centro chi mi affida il proprio progetto.',
  portrait: { src: '/images/omar-bayadi-ritratto.webp', size: [1536, 2730], alt: 'Ritratto di Omar alla luce di una finestra' },
  rows: [
    {
      label: 'Idea',
      text: "Ogni progetto parte dall'ascolto, studio degli obiettivi, pubblico e contesto prima di scrivere una riga di codice, così ogni scelta ha motivo di esistere.",
    },
    {
      label: 'Sviluppo',
      text: 'Il livello di design e codice vanno di pari passo. Costruisco interfacce veloci, animate e accessibili, curate nei dettagli pensati per dare personalità ai progetti.',
    },
  ],
  results: {
    label: 'Risultati',
    stats: [
      { label: 'Anni di esperienza', value: 2 },
      { label: 'Tecnologie usate', value: 10, suffix: '+' },
    ],
    cta: { label: 'Vedi i progetti', href: anchor(SECTION.work) },
  },
}
