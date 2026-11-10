'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { DESKTOP, PROJECTS } from '@/content'
import { AppIcon } from './registry'
import './Spotlight.css'

const T = DESKTOP.spotlight

/** La ricerca del computer: trova app e progetti, anche quelli senza demo, mentre si scrive. */
export default function Spotlight({ apps, onPick, onClose }) {
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const matching = apps.filter((app) => app.title.toLowerCase().includes(q))
    const shown = new Set(matching.map((app) => app.project))
    const others = PROJECTS.filter(
      (p) => !shown.has(p) && `${p.title} ${p.tag} ${p.description}`.toLowerCase().includes(q),
    ).map((project) => ({
      id: `file-${project.title}`,
      kind: 'project',
      title: project.title,
      project,
      file: true,
    }))
    return [...matching, ...others].slice(0, 7)
  }, [apps, query])

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (results.length) setIndex((i) => (i + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length)
    } else if (e.key === 'Enter' && results[index]) {
      onPick(results[index])
    }
  }

  return (
    <div className="spotlight" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="spotlight__panel" role="search" aria-label={T.label}>
        <input
          ref={inputRef}
          value={query}
          placeholder={T.placeholder}
          aria-label={T.placeholder}
          onChange={(e) => {
            setQuery(e.target.value)
            setIndex(0)
          }}
          onKeyDown={onKeyDown}
        />
        {query.trim() && (
          <ul>
            {results.length === 0 && <li className="spotlight__empty">{T.empty}</li>}
            {results.map((app, i) => (
              <li key={app.id}>
                <button
                  type="button"
                  className={i === index ? 'is-active' : ''}
                  onPointerEnter={() => setIndex(i)}
                  onClick={() => onPick(app)}
                >
                  <span className="spotlight__icon">
                    <AppIcon app={app} />
                  </span>
                  {app.title}
                  <small>{app.project ? T.projects : T.apps}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
