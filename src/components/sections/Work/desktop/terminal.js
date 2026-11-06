import { DESKTOP, PROFILES, PROJECTS, SITE, SKILLS } from '@/content'

const T = DESKTOP.terminal

const findProject = (name) => {
  const wanted = name.toLowerCase().replace(/\s/g, '')
  return PROJECTS.find((p) => p.title.toLowerCase().replace(/\s/g, '') === wanted)
}

/**
 * Esegue una riga del terminale. Restituisce le righe da stampare e, se serve,
 * un effetto sul desktop: `clear` svuota, `open` apre un'app del dock
 * (`target` è il titolo), `url` apre un sito, `exit` chiude la finestra.
 */
export function runCommand(input, now = new Date()) {
  const [command = '', ...args] = input.trim().split(/\s+/)
  const rest = args.join(' ')

  switch (command) {
    case '':
      return { lines: [] }
    case 'help':
      return { lines: T.help }
    case 'whoami':
      return { lines: [`${SITE.fullName} · ${SITE.role}`] }
    case 'pwd':
      return { lines: [T.home] }
    case 'date':
      return { lines: [now.toLocaleString(SITE.locale.replace('_', '-'))] }
    case 'ls':
      return { lines: PROJECTS.map((p) => p.title) }
    case 'cat': {
      const project = findProject(rest)
      if (!rest) return { lines: [T.catUsage] }
      return { lines: project ? [`${project.title} · ${project.tag}`, project.description] : [`cat: ${rest}: ${T.notFound}`] }
    }
    case 'open': {
      if (!rest) return { lines: [T.openUsage] }
      const project = findProject(rest)
      if (project?.video) return { lines: [], open: project.title }
      if (project?.href) return { lines: [], url: project.href }
      if (project) return { lines: [`${project.title}: ${T.noDemo}`] }
      return { lines: [], open: rest }
    }
    case 'skills':
      return { lines: [SKILLS.join(' · ')] }
    case 'contact':
      return { lines: [SITE.email, ...PROFILES.map((p) => `${p.label}: ${p.href}`)] }
    case 'echo':
      return { lines: [rest] }
    case 'sudo':
      return { lines: [T.sudo] }
    case 'clear':
      return { lines: [], clear: true }
    case 'exit':
      return { lines: [], exit: true }
    default:
      return { lines: [`${command}: ${T.unknown}`] }
  }
}
