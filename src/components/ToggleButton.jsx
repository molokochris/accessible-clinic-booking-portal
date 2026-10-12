/**
 * A two-state toggle button. aria-pressed mirrors the `pressed` prop, and the
 * visible check mark means the state is not shown by colour alone (WCAG 1.4.1).
 */
export default function ToggleButton({ pressed, onToggle, children }) {
  return (
    <button
      type="button"
      className="chip"
      aria-pressed={pressed}
      onClick={onToggle}
    >
      <span className="chip-mark" aria-hidden="true">
        {pressed ? '✓' : ''}
      </span>
      {children}
    </button>
  )
}
