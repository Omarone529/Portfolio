'use client'

import { useSyncExternalStore } from 'react'
import { DESKTOP, WORK } from '@/content'

const M = DESKTOP.menus
const S = DESKTOP.status

const formatNow = () =>
  new Date()
    .toLocaleString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    .replace(',', '')

const subscribeClock = (onChange) => {
  const timer = setInterval(onChange, 10_000)
  return () => clearInterval(timer)
}

/** Data e ora correnti, aggiornate ogni pochi secondi; durante il prerender sono vuote. */
function Clock() {
  const time = useSyncExternalStore(subscribeClock, formatNow, () => '')
  return <time className="desktop__clock">{time}</time>
}

/** I menu della barra, costruiti da quello che il computer sa fare in questo momento. */
function buildMenus(os) {
  const { focusedApp, focusedWin, apps, windows } = os
  const id = focusedApp?.id
  const site = focusedApp?.project?.href
  return [
    {
      key: 'system',
      label: M.system,
      mark: true,
      items: [
        { label: M.about, onSelect: () => os.openApp('about') },
        'sep',
        { label: M.settings, onSelect: () => os.openApp('settings') },
        'sep',
        { label: M.sleep, onSelect: () => os.setPower('sleep') },
        { label: M.restart, onSelect: () => os.setPower('restart') },
        { label: M.shutdown, onSelect: () => os.setPower('off') },
        'sep',
        { label: M.lock, onSelect: () => os.setPower('locked') },
      ],
    },
    {
      key: 'file',
      label: M.file,
      items: [
        { label: M.newFinder, onSelect: () => os.openApp('finder') },
        { label: M.openSite, disabled: !site, onSelect: () => os.openUrl(site) },
        'sep',
        { label: M.closeWindow, hint: '⌥W', disabled: !id, onSelect: () => os.closeApp(id) },
      ],
    },
    {
      key: 'view',
      label: M.view,
      items: [
        { label: M.missionControl, hint: '⌥↑', onSelect: os.toggleOverview },
        { label: os.parked ? M.showWindows : M.showDesktop, onSelect: os.toggleDesktop },
        { label: M.tidy, onSelect: os.tidyIcons },
        'sep',
        { label: M.hideDock, checked: os.settings.autohide, onSelect: () => os.set('autohide', !os.settings.autohide) },
        { label: S.lens, checked: os.settings.lens, onSelect: () => os.set('lens', !os.settings.lens) },
        'sep',
        { label: os.full ? M.exitFull : M.enterFull, onSelect: () => os.setFull(!os.full) },
      ],
    },
    {
      key: 'window',
      label: M.window,
      items: [
        ...(focusedWin ? os.windowItems(id) : [{ label: M.minimize, disabled: true }]),
        'sep',
        ...apps
          .filter((app) => windows[app.id])
          .map((app) => ({ label: app.title, checked: app.id === id, onSelect: () => os.openApp(app.id) })),
      ],
    },
    {
      key: 'help',
      label: M.help,
      items: [
        ...DESKTOP.shortcuts.map(([keys, label]) => ({ label, hint: keys, disabled: true })),
        'sep',
        { label: M.contact, onSelect: () => os.openApp('mail') },
      ],
    },
  ]
}

/** La barra in alto: menu a sinistra, stato e orologio a destra. */
export default function MenuBar({ os, title, screenRef, active, openMenu }) {
  const menus = buildMenus(os)

  const show = (menu, button) => {
    const box = button.getBoundingClientRect()
    const screen = screenRef.current.getBoundingClientRect()
    openMenu({ key: menu.key, x: box.left - screen.left, y: box.bottom - screen.top, items: menu.items })
  }

  return (
    <div className="desktop__menubar">
      <div className="desktop__menus">
        {menus.map((menu) => (
          <button
            key={menu.key}
            type="button"
            data-menu-trigger
            className={`desktop__menu ${menu.mark ? 'desktop__menu--mark' : ''} ${active === menu.key ? 'is-active' : ''}`}
            aria-haspopup="menu"
            aria-expanded={active === menu.key}
            aria-label={menu.mark ? menu.label : undefined}
            onClick={(e) => (active === menu.key ? os.closeMenu() : show(menu, e.currentTarget))}
            onPointerEnter={(e) => active && active !== menu.key && show(menu, e.currentTarget)}
          >
            {menu.mark ? <span className="desktop__mark" /> : menu.label}
          </button>
        ))}
      </div>
      <span className="desktop__app">{title}</span>

      <span className="desktop__status">
        <button type="button" className="desktop__glyph" aria-label={S.search} onClick={os.openSpotlight}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
        </button>
        <button
          type="button"
          data-menu-trigger
          className={`desktop__glyph ${os.controlOpen ? 'is-active' : ''}`}
          aria-label={S.control}
          aria-expanded={os.controlOpen}
          onClick={os.toggleControl}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 5h8M2 11h3M12 5h2M9 11h5" />
            <circle cx="11" cy="5" r="1.8" />
            <circle cx="6.8" cy="11" r="1.8" />
          </svg>
        </button>
        {/* a schermo intero serve un modo per uscire anche dove non c'è Esc (iPhone) */}
        {os.full && (
          <button type="button" className="desktop__glyph" aria-label={WORK.exitFullscreen} onClick={() => os.setFull(false)}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" />
            </svg>
          </button>
        )}
        <Clock />
      </span>
    </div>
  )
}

/** Il centro di controllo: aspetto, lente del dock e luminosità, gli stessi delle impostazioni. */
export function ControlCenter({ os, onClose }) {
  const { settings, set } = os
  return (
    <div className="control-center" role="dialog" aria-label={S.control} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <label>
        {S.dark}
        <input type="checkbox" role="switch" checked={settings.dark} onChange={(e) => set('dark', e.target.checked)} />
      </label>
      <label>
        {S.lens}
        <input type="checkbox" role="switch" checked={settings.lens} onChange={(e) => set('lens', e.target.checked)} />
      </label>
      <label className="control-center__range">
        {S.brightness}
        <input
          type="range"
          min="40"
          max="100"
          value={settings.brightness}
          onChange={(e) => set('brightness', Number(e.target.value))}
        />
      </label>
    </div>
  )
}
