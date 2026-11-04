/** Dati generali del sito: chi, come contattarlo, quali sezioni esistono. */

export const SITE = {
  name: 'OMAR',
  fullName: 'Omar Bayadi',
  role: 'Creative Developer',
  email: 'omar.bayadi.lavoro@gmail.com',
  year: '2026',
}

/** Gli id delle sezioni: unica fonte per ancore e link interni. */
export const SECTION = {
  top: 'top',
  about: 'about',
  work: 'work',
  services: 'services',
  contact: 'contact',
}

/** Costruisce il link interno verso una sezione. */
export const anchor = (id) => `#${id}`

export const NAV = [
  { label: 'Home', href: anchor(SECTION.top) },
  { label: 'About', href: anchor(SECTION.about) },
  { label: 'Progetti', href: anchor(SECTION.work) },
  { label: 'Servizi', href: anchor(SECTION.services) },
  { label: 'Contatti', href: anchor(SECTION.contact) },
]

export const STACK = [
  'React',
  'TypeScript',
  'Vite',
  'Tailwind CSS',
  'Three.js',
  'Python',
  'FastAPI',
  'Django',
  'PostgreSQL',
  'Electron',
  'Flutter',
  'Docker',
]
