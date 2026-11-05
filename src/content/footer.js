import { COOKIES, PRIVACY } from './legal'
import { SITE } from './site'

export const FOOTER = {
  title: 'Lavoriamo insieme',
  cta: 'Contattami',
  legal: `© ${SITE.year}, Tutti i diritti riservati`,
  credit: `${SITE.fullName} · ${SITE.role}`,
  links: [
    { label: 'Privacy', href: PRIVACY.path },
    { label: 'Cookie policy', href: COOKIES.path },
  ],
}
