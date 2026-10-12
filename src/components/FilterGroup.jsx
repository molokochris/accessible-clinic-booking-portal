import { useState } from 'react'

/**
 * Expandable filter group (accordion).
 *
 * aria-expanded lives on the <button> and is derived from the same `expanded`
 * state that hides the panel, so the accessibility tree can never disagree
 * with what is on screen. A native <button> gives Enter and Space for free.
 */
export default function FilterGroup({ id, title, defaultExpanded = true, children }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const buttonId = `${id}-button`
  const panelId = `${id}-panel`

  return (
    <div className="filter-group">
      <h3>
        <button
          type="button"
          id={buttonId}
          className="accordion-trigger"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((open) => !open)}
        >
          <span>{title}</span>
          <span aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
      </h3>
      <fieldset id={panelId} hidden={!expanded}>
        <legend className="visually-hidden">{title}</legend>
        {children}
      </fieldset>
    </div>
  )
}
