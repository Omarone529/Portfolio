'use client'

import { DESKTOP } from '@/content'
import './Settings.css'

/** Impostazioni: sfondo, aspetto, luminosità e dock, gli stessi del centro di controllo. */
export default function Settings({ os }) {
  const T = DESKTOP.settings
  const { settings, set } = os
  return (
    <div className="settings">
      <h4>{T.wallpaper}</h4>
      <div className="settings__walls">
        {T.wallpapers.map((wall, i) => (
          <button
            key={wall.name}
            type="button"
            aria-pressed={settings.wallpaper === i}
            onClick={() => set('wallpaper', i)}
          >
            <img
              src={wall.src}
              alt=""
              width={DESKTOP.wallpaperSize[0]}
              height={DESKTOP.wallpaperSize[1]}
              loading="lazy"
              decoding="async"
              style={{ background: wall.color }}
            />
            {wall.name}
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
        <input
          type="checkbox"
          role="switch"
          checked={settings.autohide}
          onChange={(e) => set('autohide', e.target.checked)}
        />
      </label>
    </div>
  )
}
