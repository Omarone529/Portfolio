import { DESKTOP } from '@/content'

const N = DESKTOP.appNames

/** Le misure con cui si apre ogni app di sistema, in percentuale del display. */
const SIZES = {
  finder: { w: 70, h: 66 },
  notes: { w: 58, h: 60 },
  mail: { w: 50, h: 60 },
  terminal: { w: 56, h: 52 },
  calculator: { w: 30, h: 72 },
  settings: { w: 54, h: 66 },
  about: { w: 36, h: 52 },
  trash: { w: 44, h: 44 },
}

const system = (id, title = N[id]) => ({ id, kind: id, title, size: SIZES[id] })

/** Tutte le app del computer, nell'ordine del dock. `about` si apre solo dal menu, quindi non ci sta. */
export function buildApps(projects) {
  return [
    system('finder'),
    ...projects.map((project, index) => ({
      id: `project-${index}`,
      kind: 'project',
      title: project.title,
      project,
    })),
    system('notes'),
    system('mail'),
    system('terminal'),
    system('calculator'),
    system('settings'),
    system('trash'),
  ]
}

export const ABOUT_APP = system('about', DESKTOP.settings.aboutTitle)

/** Il titolo di una nota: quello fisso se ce l'ha, altrimenti la prima riga scritta. */
export const noteTitle = (note) => note.title ?? (note.body.trim().split('\n')[0] || DESKTOP.notes.untitled)

/* Le icone di sistema sono disegni originali: un fondo e un simbolo semplice. */
const ICONS = {
  finder: (
    <>
      <rect width="48" height="48" fill="url(#ic-sky)" />
      <path d="M26 0h22v48H22c3-8 4-14 4-20h-6c0-10 2-20 6-28z" fill="#fff" opacity=".85" />
      <path d="M14 15v6M34 15v6M12 33c7 5 17 5 24 0" stroke="#10253f" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </>
  ),
  notes: (
    <>
      <rect width="48" height="48" fill="#fffdf4" />
      <rect width="48" height="13" fill="#f7c948" />
      <path d="M9 22h30M9 30h30M9 38h20" stroke="#c9c2a8" strokeWidth="2" />
    </>
  ),
  mail: (
    <>
      <rect width="48" height="48" fill="url(#ic-sky)" />
      <rect x="8" y="13" width="32" height="23" rx="3" fill="#fff" />
      <path d="M9 15l15 12 15-12" stroke="#3a86d8" strokeWidth="2.4" fill="none" />
    </>
  ),
  terminal: (
    <>
      <rect width="48" height="48" fill="#1c1c1f" />
      <path d="M11 15l9 8-9 8M23 33h13" stroke="#e8e8e8" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  calculator: (
    <>
      <rect width="48" height="48" fill="#2b2b2e" />
      <rect x="10" y="9" width="28" height="9" rx="2" fill="#8f8f94" />
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((col) => (
          <circle key={`${row}${col}`} cx={14 + col * 10} cy={25 + row * 7.5} r="3" fill={col === 2 ? '#f59e2b' : '#d9d9dc'} />
        )),
      )}
    </>
  ),
  settings: (
    <>
      <rect width="48" height="48" fill="#8e9096" />
      <g stroke="#ececef" strokeWidth="5" strokeLinecap="round">
        {[0, 45, 90, 135].map((angle) => (
          <path key={angle} d="M24 9v30" transform={`rotate(${angle} 24 24)`} />
        ))}
      </g>
      <circle cx="24" cy="24" r="10" fill="#ececef" />
      <circle cx="24" cy="24" r="5" fill="#8e9096" />
    </>
  ),
  trash: (
    <>
      <rect width="48" height="48" fill="#e7e8ea" />
      <path d="M14 16h20l-2 23H16zM11 14h26M20 13c0-4 8-4 8 0" stroke="#7b7e85" strokeWidth="2.4" fill="none" strokeLinejoin="round" />
      <path d="M20 21l1 13M24 21v13M28 21l-1 13" stroke="#a7aab0" strokeWidth="1.8" />
    </>
  ),
  about: (
    <>
      <rect width="48" height="48" fill="#1b1b1d" />
      <circle cx="24" cy="24" r="11" stroke="#fff" strokeWidth="4" fill="none" />
    </>
  ),
  folder: (
    <>
      <path d="M4 12a3 3 0 013-3h11l4 4h19a3 3 0 013 3v22a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#3d8fe0" />
      <path d="M4 19h40v19a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#6db6f7" />
    </>
  ),
  document: (
    <>
      <path d="M11 4h19l9 9v31H11z" fill="#fff" stroke="#c9ccd1" />
      <path d="M30 4v9h9" fill="#e7e8ea" stroke="#c9ccd1" />
      <path d="M17 22h16M17 28h16M17 34h10" stroke="#a7aab0" strokeWidth="2" />
    </>
  ),
}

/** Un'icona di sistema disegnata, per nome. */
export function SystemIcon({ name }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="ic-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fc3f7" />
          <stop offset="1" stopColor="#2f7fdc" />
        </linearGradient>
      </defs>
      {ICONS[name]}
    </svg>
  )
}

/** L'icona di un'app: per i progetti il logo sul loro fondo, per le altre il disegno. */
export function AppIcon({ app }) {
  if (app.kind !== 'project') return <SystemIcon name={app.kind} />
  const { project } = app
  return (
    <span className="app-icon" style={{ background: project.tint }}>
      <img src={project.logo} alt="" width={project.logoSize[0]} height={project.logoSize[1]} loading="lazy" decoding="async" />
    </span>
  )
}
