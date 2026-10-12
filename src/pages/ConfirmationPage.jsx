import { Link, useLocation } from 'react-router-dom'
import { dayLabel } from '../data/services.js'
import usePageTitle from '../hooks/usePageTitle.js'

export default function ConfirmationPage() {
  usePageTitle('Appointment confirmed')
  const booking = useLocation().state?.booking

  if (!booking) {
    return (
      <>
        <h1>No booking to show</h1>
        <p>You have not booked an appointment in this session.</p>
        <Link className="button button-primary" to="/services">
          Browse clinic services
        </Link>
      </>
    )
  }

  const { service } = booking

  return (
    <>
      <h1>Appointment confirmed</h1>

      <section className="success-banner" aria-labelledby="reference-title">
        <h2 id="reference-title">
          <span className="icon icon-success" aria-hidden="true">
            {'✓'}
          </span>
          Your booking reference
        </h2>
        <p className="reference">{booking.reference}</p>
        <p>A confirmation will be sent to {booking.email}.</p>
      </section>

      <section className="summary" aria-labelledby="details-title">
        <h2 id="details-title">Your appointment details</h2>
        <dl>
          <div>
            <dt>Service</dt>
            <dd>{service.title}</dd>
          </div>
          <div>
            <dt>Practitioner</dt>
            <dd>{service.practitioner}</dd>
          </div>
          <div>
            <dt>Date and time</dt>
            <dd>
              {dayLabel(service.day)}, {service.time}
            </dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{service.room}</dd>
          </div>
          <div>
            <dt>Patient</dt>
            <dd>{booking.name}</dd>
          </div>
          <div>
            <dt>Telephone</dt>
            <dd>{booking.phone}</dd>
          </div>
        </dl>
      </section>

      <div className="button-group">
        <Link className="button button-primary" to="/services">
          Book another appointment
        </Link>
        <Link className="button button-secondary" to="/">
          Return to the home page
        </Link>
      </div>
    </>
  )
}
