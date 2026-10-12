import { Link, useParams } from 'react-router-dom'
import BookingForm from '../components/BookingForm.jsx'
import { getService } from '../data/services.js'
import usePageTitle from '../hooks/usePageTitle.js'

export default function BookingPage() {
  usePageTitle('Book an appointment')
  const { serviceId } = useParams()
  const service = serviceId ? getService(serviceId) : undefined

  if (!service) {
    return (
      <>
        <h1>Book an appointment</h1>
        <p>
          {serviceId
            ? 'We could not find that service.'
            : 'Choose a service and time first, then you can enter your details.'}
        </p>
        <Link className="button button-primary" to="/services">
          Browse clinic services
        </Link>
      </>
    )
  }

  return <BookingForm service={service} />
}
