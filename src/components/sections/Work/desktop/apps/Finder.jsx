'use client'

import { useMemo, useState } from 'react'
import { DESKTOP, PROFILES, PROJECTS } from '@/content'
import { AppIcon, noteTitle } from './apps'

const F = DESKTOP.finder

/** Le cartelle della barra laterale, nell'ordine in cui si vedono. */
const PLACES = ['applications', 'projects', 'documents', 'links', 'trash']

/** Il contenuto vero di ogni cartella: niente file finti, solo quello che c'è nel computer. */
function itemsOf(place, os) {
  if (place === 'applications') {
    return os.apps
      .filter((app) => !app.project && app.kind !== 'trash')
      .map((app) => ({ id: app.id, title: app.title, kind: F.application, app, onOpen: () => os.openApp(app.id) }))
  }
  if (place === 'projects') {
    return PROJECTS.map((project) => {
      const app = os.apps.find((a) => a.project === project)
      const onOpen = app ? () => os.openApp(app.id) : project.href ? () => os.openUrl(project.href) : null
      return {
        id: project.title,
        title: project.title,
        kind: project.tag,
        text: project.description,
        href: project.href,
        app: { kind: 'project', project },
        openLabel: app ? F.openDemo : null,
        onOpen,
        note: onOpen ? null : F.private,
      }
    })
  }
  if (place === 'documents') {
    return os.notes.map((note) => ({
      id: note.id,
      title: noteTitle(note),
      kind: F.note,
      text: note.body.slice(0, 160),
      app: { kind: 'document' },
      onOpen: () => {
        os.setNoteId(note.id)
        os.openApp('notes')
      },
    }))
  }
  if (place === 'links') {
    return PROFILES.map((profile) => ({
      id: profile.href,
      title: profile.label,
      kind: F.link,
      href: profile.href,
      app: { kind: 'document' },
      onOpen: () => os.openUrl(profile.href),
    }))
  }
  return []
}

/**
 * Il Finder: le cartelle del computer con avanti e indietro, ricerca nella
 * cartella, vista a icone o a elenco e il pannello con i dettagli di ciò che
 * è selezionato. Un clic seleziona e il doppio clic apre; al tocco apre subito.
 */
export default function Finder({ os }) {
  const [path, setPath] = useState({ list: ['projects'], at: 0 })
  const [view, setView] = useState('icons')
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')

  const place = path.list[path.at]
  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    const all = itemsOf(place, os)
    return q ? all.filter((i) => `${i.title} ${i.kind}`.toLowerCase().includes(q)) : all
  }, [place, os, query])
  const selected = items.find((i) => i.id === selectedId) ?? null

  const reset = () => {
    setSelectedId(null)
    setQuery('')
  }
  const goTo = (next) => {
    if (next === place) return
    setPath(({ list, at }) => ({ list: [...list.slice(0, at + 1), next], at: at + 1 }))
    reset()
  }
  const step = (by) => {
    setPath((p) => ({ ...p, at: p.at + by }))
    reset()
  }

  return (
    <div className="finder">
      <aside className="finder__side">
        <small>{F.sidebar}</small>
        {PLACES.map((key) => (
          <button key={key} type="button" aria-pressed={place === key} onClick={() => goTo(key)}>
            {F[key]}
          </button>
        ))}
      </aside>

      <div className="finder__main">
        <div className="finder__tools">
          <span className="finder__nav">
            <button type="button" aria-label={F.back} disabled={path.at === 0} onClick={() => step(-1)}>
              ‹
            </button>
            <button
              type="button"
              aria-label={F.forward}
              disabled={path.at === path.list.length - 1}
              onClick={() => step(1)}
            >
              ›
            </button>
          </span>
          <strong>{F[place]}</strong>
          <span className="finder__views">
            {['icons', 'list'].map((key) => (
              <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)}>
                {F[key]}
              </button>
            ))}
          </span>
          <input
            type="search"
            value={query}
            placeholder={F.search}
            aria-label={F.search}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="finder__body">
          <div
            className={`finder__items finder__items--${view}`}
            onPointerDown={(e) => e.target === e.currentTarget && setSelectedId(null)}
          >
            {items.length === 0 && <p className="finder__empty">{query ? F.noResults : F.empty}</p>}
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected === item}
                onClick={(e) => {
                  setSelectedId(item.id)
                  if (e.nativeEvent.pointerType === 'touch') item.onOpen?.()
                }}
                onDoubleClick={() => item.onOpen?.()}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return
                  e.preventDefault()
                  item.onOpen?.()
                }}
              >
                <span className="finder__icon">
                  <AppIcon app={item.app} />
                </span>
                <span className="finder__name">{item.title}</span>
                {view === 'list' && <small>{item.kind}</small>}
              </button>
            ))}
          </div>

          <aside className="finder__preview">
            {selected ? (
              <>
                <span className="finder__icon finder__icon--large">
                  <AppIcon app={selected.app} />
                </span>
                <strong>{selected.title}</strong>
                <small>{selected.kind}</small>
                {selected.text && <p>{selected.text}</p>}
                {selected.onOpen && selected.kind !== F.link && (
                  <button type="button" onClick={selected.onOpen}>
                    {selected.openLabel ?? F.open}
                  </button>
                )}
                {selected.href && (
                  <a href={selected.href} target="_blank" rel="noreferrer">
                    {F.visit}
                  </a>
                )}
                {selected.note && <small>{selected.note}</small>}
              </>
            ) : (
              <small>{F.hint}</small>
            )}
          </aside>
        </div>

        <footer className="finder__status">
          {items.length} {items.length === 1 ? F.countOne : F.count}
        </footer>
      </div>
    </div>
  )
}
