/** Testo che "rotola" in hover: due copie sovrapposte che scorrono in verticale (vedi useHoverPlay). */
export function RollText({ children }) {
  return (
    <span className="roll">
      <span className="roll__in">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  )
}
