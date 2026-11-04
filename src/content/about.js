import { SECTION, anchor } from './site'

export const ABOUT = {
  label: 'About',
  statement:
    'Sono Omar, creative developer. Progetto e sviluppo siti web, applicazioni e web app su misura per brand e persone che vogliono distinguersi.',
  portrait: { src: '/images/hero.webp', size: [1920, 1080], alt: 'Ritratto di Omar' },
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
