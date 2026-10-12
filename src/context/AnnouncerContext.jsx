import { useCallback, useEffect, useRef, useState } from 'react'
import { AnnouncerContext } from './announcerContext.js'

/**
 * One persistent, visually hidden polite live region for the whole app.
 *
 * The region is mounted from the first render and only its text changes, which
 * is what makes screen readers announce it reliably (a live region that is
 * inserted together with its text is often skipped).
 *
 * The text is cleared first and set again after a short delay so that the same
 * message announced twice in a row is still read out.
 */
export function AnnouncerProvider({ children }) {
  const [message, setMessage] = useState('')
  const timer = useRef(null)

  const announce = useCallback((text) => {
    clearTimeout(timer.current)
    setMessage('')
    timer.current = setTimeout(() => setMessage(text), 100)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <AnnouncerContext.Provider value={announce}>
      {children}
      <div
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="announcer"
      >
        {message}
      </div>
    </AnnouncerContext.Provider>
  )
}
