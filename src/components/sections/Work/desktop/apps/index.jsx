import About from './About'
import Calculator from './Calculator'
import Finder from './Finder'
import Mail from './Mail'
import Notes from './Notes'
import Settings from './Settings'
import Terminal from './Terminal'
import Trash from './Trash'
import './apps.css'

export { startingNotes } from './Notes'

/** Le app di sistema, per `kind` (vedi registry.jsx). */
const VIEWS = {
  finder: Finder,
  notes: Notes,
  mail: Mail,
  terminal: Terminal,
  calculator: Calculator,
  settings: Settings,
  about: About,
  trash: Trash,
}

/** Il contenuto della finestra di un'app di sistema. */
export default function SystemApp({ app, os }) {
  const View = VIEWS[app.kind]
  return <View os={os} id={app.id} />
}
