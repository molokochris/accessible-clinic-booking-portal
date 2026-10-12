import { Link } from 'react-router-dom'
import { dayLabel } from '../data/services.js'

export default function ResultsList({ services }) {
  return (
    <ul className="result-list">
      {services.map((service) => (
        <li key={service.id}>
          <article aria-labelledby={`${service.id}-title`}>
            <div className="result-head">
              <h3 id={`${service.id}-title`}>{service.title}</h3>
              <p className="result-time">
                {dayLabel(service.day)}, {service.time}
                <br />
                {service.room}
              </p>
            </div>
            {service.urgency === 'same-day' && <p className="badge">Same-day triage</p>}
            <p>
              <strong>Practitioner:</strong> {service.practitioner}
            </p>
            <p>{service.description}</p>
            {/* Unique, descriptive link name: WCAG 2.4.4 */}
            <Link className="button button-primary" to={`/book/${service.id}`}>
              Book {service.title}
            </Link>
          </article>
        </li>
      ))}
    </ul>
  )
}
