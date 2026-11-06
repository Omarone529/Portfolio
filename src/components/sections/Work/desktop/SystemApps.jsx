'use client'

import { useEffect, useRef, useState } from 'react'
import { DESKTOP, PROFILES, SITE } from '@/content'
import { noteTitle, SystemIcon } from './apps'
import { CALC_START, pressKey } from './calculator'
import Finder from './Finder'
import { runCommand } from './terminal'

/** Si parte da un foglio bianco, più i contatti. Senza un titolo fisso, il titolo è la prima riga scritta. */
export const startingNotes = () => [
  { id: 'blank', body: '' },
  {
    id: 'contact',
    title: DESKTOP.notes.contact,
    body: `${DESKTOP.notes.contactBody}\n\n${SITE.email}\n\n${PROFILES.map((p) => `${p.label}: ${p.href}`).join('\n')}`,
  },
]

function Notes({ os }) {
  const { notes, setNotes, noteId, setNoteId } = os
  const textRef = useRef(null)
  const note = notes.find((n) => n.id === noteId) ?? notes[0]

  // si apre pronta per scrivere, anche passando a un'altra nota
  useEffect(() => {
    textRef.current?.focus({ preventScroll: true })
  }, [note.id])

  const add = () => {
    const id = `note-${Date.now()}`
    setNotes((list) => [{ id, body: '' }, ...list])
    setNoteId(id)
  }

  return (
    <div className="notes">
      <aside>
        <button type="button" className="notes__new" onClick={add}>
          {DESKTOP.notes.newNote}
        </button>
        {notes.map((n) => (
          <button key={n.id} type="button" aria-pressed={n.id === note.id} onClick={() => setNoteId(n.id)}>
            {noteTitle(n)}
          </button>
        ))}
      </aside>
      <textarea
        ref={textRef}
        aria-label={noteTitle(note)}
        placeholder={DESKTOP.notes.placeholder}
        value={note.body}
        onChange={(e) => {
          const body = e.target.value
          setNotes((list) => list.map((n) => (n.id === note.id ? { ...n, body } : n)))
        }}
      />
    </div>
  )
}

/** Scrive il messaggio qui, poi lo passa all'app di posta di chi guarda. */
function Mail() {
  const T = DESKTOP.mail
  const [subject, setSubject] = useState(T.defaultSubject)
  const [body, setBody] = useState('')

  const send = (e) => {
    e.preventDefault()
    const query = new URLSearchParams({ subject, body }).toString().replace(/\+/g, '%20')
    window.location.href = `mailto:${SITE.email}?${query}`
  }

  return (
    <form className="mail" onSubmit={send}>
      <p>
        <span>{T.to}</span> {SITE.email}
      </p>
      <label>
        <span>{T.subject}</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <textarea aria-label={T.body} placeholder={T.body} value={body} onChange={(e) => setBody(e.target.value)} />
      <footer>
        <small>{T.hint}</small>
        <button type="submit">{T.send}</button>
      </footer>
    </form>
  )
}

function Terminal({ os, id }) {
  const T = DESKTOP.terminal
  const [lines, setLines] = useState([T.welcome])
  const [input, setInput] = useState('')
  const history = useRef({ list: [], at: 0 })
  const inputRef = useRef(null)
  const endRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [lines])

  const submit = (e) => {
    e.preventDefault()
    const result = runCommand(input)
    history.current = { list: [...history.current.list, input], at: history.current.list.length + 1 }
    setInput('')
    if (result.exit) return os.closeApp(id)
    if (result.clear) return setLines([])
    if (result.url) os.openUrl(result.url)
    const failed = result.open && !os.openByName(result.open)
    setLines((old) => [...old, `${T.prompt} ${input}`, ...result.lines, ...(failed ? [`open: ${T.cannotOpen}`] : [])])
  }

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()
    const { list, at } = history.current
    const next = Math.min(list.length, Math.max(0, at + (e.key === 'ArrowUp' ? -1 : 1)))
    history.current.at = next
    setInput(list[next] ?? '')
  }

  return (
    <div className="terminal" onPointerUp={() => getSelection().isCollapsed && inputRef.current?.focus({ preventScroll: true })}>
      {lines.map((line, i) => (
        <pre key={i}>{line}</pre>
      ))}
      <form onSubmit={submit}>
        <span>{T.prompt}</span>
        <input
          ref={inputRef}
          value={input}
          aria-label={T.prompt}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </form>
      <span ref={endRef} />
    </div>
  )
}

const CALC_KEYS = ['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '=']
const KEYBOARD = { '*': '×', '/': '÷', '-': '−', Enter: '=', ',': '.', Escape: 'C', Backspace: 'C' }

function Calculator() {
  const [state, setState] = useState(CALC_START)
  const press = (key) => setState((s) => pressKey(s, key))

  const onKeyDown = (e) => {
    const key = KEYBOARD[e.key] ?? e.key
    if (!CALC_KEYS.includes(key)) return
    e.preventDefault()
    press(key)
  }

  return (
    <div className="calculator" tabIndex={0} onKeyDown={onKeyDown}>
      <output>{state.display.replace('.', ',')}</output>
      <div>
        {CALC_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            tabIndex={-1}
            className={`${/[÷×−+=]/.test(key) ? 'is-op' : ''} ${key === '0' ? 'is-wide' : ''}`}
            onClick={() => press(key)}
          >
            {key === '.' ? ',' : key}
          </button>
        ))}
      </div>
    </div>
  )
}

function Settings({ os }) {
  const T = DESKTOP.settings
  const { settings, set } = os
  return (
    <div className="settings">
      <h4>{T.wallpaper}</h4>
      <div className="settings__walls">
        {T.wallpapers.map((name, i) => (
          <button key={name} type="button" aria-pressed={settings.wallpaper === i} onClick={() => set('wallpaper', i)}>
            <span className={`wall-${i}`} />
            {name}
          </button>
        ))}
      </div>
      <h4>{T.appearance}</h4>
      <label>
        {DESKTOP.status.dark}
        <input type="checkbox" role="switch" checked={settings.dark} onChange={(e) => set('dark', e.target.checked)} />
      </label>
      <label>
        {DESKTOP.status.brightness}
        <input
          type="range"
          min="40"
          max="100"
          value={settings.brightness}
          onChange={(e) => set('brightness', Number(e.target.value))}
        />
      </label>
      <h4>{T.dock}</h4>
      <label>
        {DESKTOP.status.lens}
        <input type="checkbox" role="switch" checked={settings.lens} onChange={(e) => set('lens', e.target.checked)} />
      </label>
      <label>
        {DESKTOP.menus.hideDock}
        <input type="checkbox" role="switch" checked={settings.autohide} onChange={(e) => set('autohide', e.target.checked)} />
      </label>
    </div>
  )
}

function About() {
  return (
    <div className="about-pc">
      <span className="about-pc__icon">
        <SystemIcon name="about" />
      </span>
      <strong>{SITE.fullName}</strong>
      <small>{SITE.role}</small>
      <dl>
        {DESKTOP.settings.specs.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Trash() {
  return <div className="trash">{DESKTOP.trash.empty}</div>
}

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
