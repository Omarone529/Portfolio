'use client'

import { useState } from 'react'
import { DESKTOP, SITE } from '@/content'
import { gmailCompose } from '@/lib/mail'
import './Mail.css'

/** Scrive il messaggio qui, poi lo apre in Gmail già pronto da inviare. */
export default function Mail() {
  const T = DESKTOP.mail
  const [subject, setSubject] = useState(T.defaultSubject)
  const [body, setBody] = useState('')

  const send = (e) => {
    e.preventDefault()
    window.open(gmailCompose(SITE.email, { subject, body }), '_blank', 'noreferrer')
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
