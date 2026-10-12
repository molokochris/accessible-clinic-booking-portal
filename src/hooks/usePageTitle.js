import { useEffect } from 'react'

export const SITE_NAME = 'Poopedi Healthcare Clinic'

// WCAG 2.4.2 (Page Titled): every view sets a unique, descriptive title, and
// the page name comes first so screen readers announce it immediately.
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`
  }, [title])
}
