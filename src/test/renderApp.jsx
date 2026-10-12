import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App.jsx'

/**
 * Renders the whole app at a route. `route` may include a query string, and
 * `state` is passed as router state (used by the confirmation page).
 */
export function renderApp(route = '/', state) {
  const url = new URL(route, 'http://localhost')
  return render(
    <MemoryRouter initialEntries={[{ pathname: url.pathname, search: url.search, state }]}>
      <App />
    </MemoryRouter>,
  )
}
