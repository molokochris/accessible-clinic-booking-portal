import { Link, NavLink } from 'react-router-dom'

// NavLink adds aria-current="page" to the link for the current route, so the
// visual "current page" style and the screen reader state cannot drift apart.
export default function Header() {
  return (
    <header>
      <Link className="brand" to="/">
        <span className="logo">[ Logo ]</span>
        <span className="clinic-name">Poopedi Healthcare Clinic</span>
      </Link>
      <nav aria-label="Primary">
        <ul className="nav-list">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/services">Services</NavLink>
          </li>
          <li>
            <NavLink className="button button-primary" to="/book">
              Book an appointment
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
