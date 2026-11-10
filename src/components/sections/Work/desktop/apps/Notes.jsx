'use client'

import { useEffect, useRef } from 'react'
import { DESKTOP, PROFILES, SITE } from '@/content'
import { noteTitle } from '../registry'
import './Notes.css'

/** Si parte da un foglio bianco, più i contatti. Senza un titolo fisso, il titolo è la prima riga scritta. */
export const startingNotes = () => [
  { id: 'blank', body: '' },
  {
    id: 'contact',
    title: DESKTOP.notes.contact,
    body: `${DESKTOP.notes.contactBody}\n\n${SITE.email}\n\n${PROFILES.map((p) => `${p.label}: ${p.href}`).join('\n')}`,
  },
]

export default function Notes({ os }) {
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
