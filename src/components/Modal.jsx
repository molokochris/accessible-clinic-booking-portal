import { useEffect, useId, useRef } from 'react'

/**
 * Modal dialog built on the native <dialog> element.
 *
 * showModal() makes the rest of the page inert, so Tab stays inside the dialog
 * and the page behind it is hidden from screen readers. Escape closes it.
 * Neither is a keyboard trap, because there is always a way out (Escape or the
 * "Go back" button).
 *
 * Focus is managed by hand with refs:
 *   open  -> focus moves to the dialog heading, so the screen reader reads the
 *            dialog name and title first
 *   close -> focus returns to the control that opened the dialog
 */
export default function Modal({ open, onClose, title, returnFocusRef, children }) {
  const dialogRef = useRef(null)
  const headingRef = useRef(null)
  const openerRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      openerRef.current = document.activeElement
      dialog.showModal()
      headingRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
      const target = returnFocusRef?.current ?? openerRef.current
      target?.focus?.()
    }
  }, [open, returnFocusRef])

  // Escape fires "cancel". We stop the browser closing the dialog itself so
  // that React state stays the single source of truth.
  const handleCancel = (event) => {
    event.preventDefault()
    onClose()
  }

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} onCancel={handleCancel}>
      <h2 id={titleId} ref={headingRef} tabIndex={-1}>
        {title}
      </h2>
      {children}
    </dialog>
  )
}
