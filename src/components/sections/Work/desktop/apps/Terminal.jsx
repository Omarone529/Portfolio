'use client'

import { useEffect, useRef, useState } from 'react'
import { DESKTOP } from '@/content'
import { runCommand } from './terminal'
import './Terminal.css'

/** Il terminale: comandi veri sui contenuti del sito (vedi terminal.js), con la cronologia sulle frecce. */
export default function Terminal({ os, id }) {
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
    <div
      className="terminal"
      onPointerUp={() => getSelection().isCollapsed && inputRef.current?.focus({ preventScroll: true })}
    >
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
