import { gmailCompose } from '@/lib/mail'
import { COOKIES, PRIVACY } from './legal'
import { NAV, PROFILES, SECTION, SITE, anchor } from './site'

const instagram = PROFILES.find((p) => p.label === 'Instagram')

/** Il footer è la sezione dei contatti: email (che apre Gmail) e Instagram, poi il menu e le note legali. */
export const FOOTER = {
  title: 'Lavoriamo insieme',
  email: { label: SITE.email, href: gmailCompose(SITE.email) },
  instagram: {
    label: 'Instagram',
    handle: `@${new URL(instagram.href).pathname.replaceAll('/', '')}`,
    href: instagram.href,
  },
  credit: `${SITE.fullName} · ${SITE.role}`,
  links: [
    { label: 'Privacy', href: PRIVACY.path },
    { label: 'Cookie policy', href: COOKIES.path },
  ],
}

/** Il menu del footer: senza la voce dei contatti, perché il footer è già quella sezione. */
export const FOOTER_NAV = NAV.filter((item) => item.href !== anchor(SECTION.contact))
