import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

/**
 * Page shell: skip link, header, main landmark, footer.
 *
 * Focus management on view changes: a single-page app does not reload, so a
 * screen reader user gets no cue that the "page" changed. When the route
 * changes we move focus to the new view's <h1>, which makes the screen reader
 * announce the new page. We skip the very first render so the skip link stays
 * the first Tab stop on a fresh page load.
 */
export default function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const previousPath = useRef(pathname)

  useEffect(() => {
    // Comparing paths (instead of a "first render" flag) keeps this correct
    // under React StrictMode, which runs effects twice in development.
    if (previousPath.current === pathname) return
    previousPath.current = pathname

    const heading = mainRef.current?.querySelector('h1')
    if (heading) {
      heading.setAttribute('tabindex', '-1')
      heading.focus()
    } else {
      mainRef.current?.focus()
    }
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
