/** Dati generali del sito: chi, come contattarlo, quali sezioni esistono. */

export const SITE = {
  name: 'OMAR',
  fullName: 'Omar Bayadi',
  role: 'Full Stack Developer',
  email: 'omar.bayadi.lavoro@gmail.com',
  year: '2026',
  /** Il monogramma: nero su trasparente, il sito lo usa come maschera e lo colora col testo. */
  logo: { src: '/images/logo.webp', size: [268, 160] },
  /** Dominio pubblico, senza barra finale. Si cambia con NEXT_PUBLIC_SITE_URL senza toccare il codice. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://omarbayadi.com').replace(/\/$/, ''),
  lang: 'it',
  locale: 'it_IT',
}

/** Dove lavoro: finisce nell'indirizzo dei dati strutturati e nelle descrizioni. */
export const PLACE = {
  city: 'Reggio Emilia',
  nearby: 'Modena',
  region: 'Emilia-Romagna',
  /** ISO 3166, la forma che vuole schema.org */
  country: 'IT',
}

/** Profili pubblici: dicono ai motori (e alle AI) che queste pagine sono della stessa persona. */
export const PROFILES = [
  { label: 'GitHub', href: 'https://github.com/Omarone529' },
  { label: 'GitLab', href: 'https://gitlab.com/Omar_Bayadi' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/omar-bayadi-287453238' },
  { label: 'Instagram', href: 'https://www.instagram.com/omar_bayadi/' },
]

/** Competenze dichiarate nei dati strutturati (knowsAbout). */
export const SKILLS = [
  'Sviluppo web',
  'Sviluppo full stack',
  'Animazioni web',
  'React',
  'Next.js',
  'TypeScript',
  'Three.js',
  'Python',
  'FastAPI',
  'Django',
  'PostgreSQL',
  'Electron',
  'Flutter',
  'Docker',
]

/** Gli id delle sezioni: unica fonte per ancore e link interni. */
export const SECTION = {
  top: 'top',
  about: 'about',
  work: 'work',
  contact: 'contact',
}

/** Costruisce il link interno verso una sezione. */
export const anchor = (id) => `#${id}`

export const NAV = [
  { label: 'Home', href: anchor(SECTION.top) },
  { label: 'About', href: anchor(SECTION.about) },
  { label: 'Progetti', href: anchor(SECTION.work) },
  { label: 'Contatti', href: anchor(SECTION.contact) },
]
