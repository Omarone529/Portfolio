import { WORK } from '@/content'

/**
 * I comandi sotto il portatile: i progetti a misura di dito (su telefono il
 * dock è piccolo; da tablet in su li nasconde il CSS) e lo schermo intero.
 */
export default function LaptopControls({ apps, focused, onOpen, onFullscreen }) {
  return (
    <div className="laptop__controls">
      <div className="laptop__switcher" role="group" aria-label={WORK.switcher}>
        {apps.map((app) => (
          <button key={app.id} type="button" onClick={() => onOpen(app.id)} aria-pressed={app.id === focused}>
            {app.title}
          </button>
        ))}
      </div>
      <button type="button" className="laptop__full" onClick={onFullscreen}>
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {WORK.fullscreen}
      </button>
    </div>
  )
}
