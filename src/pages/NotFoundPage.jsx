import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle.js'

export default function NotFoundPage() {
  usePageTitle('Page not found')

  return (
    <>
      <h1>Page not found</h1>
      <p>We could not find the page you were looking for.</p>
      <Link className="button button-primary" to="/">
        Return to the home page
      </Link>
    </>
  )
}
