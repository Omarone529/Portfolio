/**
 * Righe che salgono da una maschera al caricamento della pagina, solo con CSS.
 * È la variante di MaskLines per ciò che si vede appena si apre il sito: parte
 * al primo disegno senza aspettare JavaScript, quindi il contenuto principale
 * compare subito anche su un telefono lento.
 */
export function IntroLines({ lines, as: Tag = 'div', className = '', delay = 0, stagger = 0.08 }) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span className="mask" key={i}>
          <span className="mask__in intro-rise" style={{ '--delay': `${delay + i * stagger}s` }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
