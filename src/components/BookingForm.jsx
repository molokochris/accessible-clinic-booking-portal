import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAnnouncer } from '../context/announcerContext.js'
import { dayLabel } from '../data/services.js'
import {
  FIELD_LABELS,
  FIELD_ORDER,
  validateAll,
  validateField,
} from '../utils/validation.js'
import Modal from './Modal.jsx'
import TextField from './TextField.jsx'

const INITIAL_VALUES = { fullname: '', phone: '', email: '', reason: '', consent: false }

function makeReference() {
  return `CC-${Date.now().toString(36).slice(-5).toUpperCase()}`
}

export default function BookingForm({ service }) {
  const navigate = useNavigate()
  const announce = useAnnouncer()

  const [values, setValues] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState({})
  const [submitAttempts, setSubmitAttempts] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const summaryRef = useRef(null)
  const submitRef = useRef(null)

  const errorFields = FIELD_ORDER.filter((name) => errors[name])

  // After a failed submit, move focus to the error summary (WCAG 3.3.1).
  // Only the attempt counter should trigger this, not every later keystroke.
  useEffect(() => {
    if (submitAttempts > 0) summaryRef.current?.focus()
  }, [submitAttempts])

  const setFieldError = (name, message) => {
    setErrors((current) => {
      const next = { ...current }
      if (message) next[name] = message
      else delete next[name]
      return next
    })
  }

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target
    const nextValue = type === 'checkbox' ? checked : value
    setValues((current) => ({ ...current, [name]: nextValue }))

    // Live re-validation: once a field shows an error, clear it as soon as
    // the user fixes it and tell the screen reader.
    if (errors[name]) {
      const message = validateField(name, nextValue)
      setFieldError(name, message)
      if (!message) announce(`${FIELD_LABELS[name]} is now valid.`)
    }
  }

  const handleBlur = (event) => {
    const { name, type, checked, value } = event.target
    const message = validateField(name, type === 'checkbox' ? checked : value)
    setFieldError(name, message)
    // Announce new errors only. Announcing every "valid" field would be noise.
    if (message && message !== errors[name]) {
      announce(`${FIELD_LABELS[name]}: ${message}`)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validateAll(values)
    setErrors(found)
    setSubmitAttempts((count) => count + 1)
    if (Object.keys(found).length === 0) setConfirmOpen(true)
  }

  const focusField = (event, name) => {
    event.preventDefault()
    document.getElementById(name)?.focus()
  }

  const closeDialog = () => setConfirmOpen(false)

  const confirmBooking = () => {
    navigate('/confirmation', {
      state: {
        booking: {
          reference: makeReference(),
          service,
          name: values.fullname.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          reason: values.reason.trim(),
        },
      },
    })
  }

  const count = errorFields.length

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <span>{service.title}</span>
          </li>
          <li>
            <span aria-current="page">Patient details</span>
          </li>
        </ol>
      </nav>

      <h1>Patient Details &amp; Confirmation</h1>

      <div className="booking">
        <section className="summary" aria-labelledby="summary-title">
          <h2 id="summary-title">Appointment details</h2>
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
              <dt>Duration</dt>
              <dd>{service.duration}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{service.room}</dd>
            </div>
          </dl>
          <Link to="/services">Change practitioner or time</Link>
        </section>

        <section className="booking-form" aria-labelledby="form-title">
          <h2 id="form-title">Your details</h2>
          <p>All fields are required unless marked optional.</p>

          {submitAttempts > 0 && count > 0 && (
            <section
              ref={summaryRef}
              className="error-summary"
              aria-labelledby="error-summary-title"
              tabIndex={-1}
            >
              <h3 id="error-summary-title">
                <span className="icon" aria-hidden="true">
                  !
                </span>
                {count === 1 ? 'There is 1 problem' : `There are ${count} problems`} with
                your submission
              </h3>
              <ul>
                {errorFields.map((name) => (
                  <li key={name}>
                    <a href={`#${name}`} onClick={(event) => focusField(event, name)}>
                      {FIELD_LABELS[name]}: {errors[name]}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              id="fullname"
              name="fullname"
              label="Full name"
              hint="As shown on your ID or medical card."
              error={errors.fullname}
              required
              autoComplete="name"
              value={values.fullname}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <TextField
              id="phone"
              name="phone"
              type="tel"
              label="Telephone or mobile number"
              hint="We will send appointment reminders to this number. Example: 012 345 6789."
              error={errors.phone}
              required
              autoComplete="tel"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <TextField
              id="email"
              name="email"
              type="email"
              label="Email address"
              hint="Your confirmation will be sent here."
              error={errors.email}
              required
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <TextField
              id="reason"
              name="reason"
              as="textarea"
              rows={4}
              label="Reason for visit"
              hint="A short summary of your symptoms or query. Do not enter emergency information here."
              error={errors.reason}
              optional
              value={values.reason}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <div className="field consent">
              {errors.consent && (
                <p id="consent-error" className="field-error">
                  <span className="icon" aria-hidden="true">
                    !
                  </span>
                  <span>
                    <strong>Error:</strong> {errors.consent}
                  </span>
                </p>
              )}
              <label className="check">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={values.consent}
                  aria-required="true"
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span>
                  I consent to the clinic processing my personal and clinical information in
                  line with the <a href="#main">privacy policy</a>.{' '}
                  <span className="required">(required)</span>
                </span>
              </label>
            </div>

            <div className="button-group">
              <button ref={submitRef} type="submit" className="button button-primary">
                Confirm appointment
              </button>
              <Link className="button button-secondary" to="/services">
                Cancel and return
              </Link>
            </div>
          </form>
        </section>
      </div>

      <Modal
        open={confirmOpen}
        onClose={closeDialog}
        title="Check your appointment"
        returnFocusRef={submitRef}
      >
        <p>Please check these details before we book your appointment.</p>
        <dl className="details-list">
          <div>
            <dt>Service</dt>
            <dd>{service.title}</dd>
          </div>
          <div>
            <dt>Date and time</dt>
            <dd>
              {dayLabel(service.day)}, {service.time}
            </dd>
          </div>
          <div>
            <dt>Name</dt>
            <dd>{values.fullname.trim()}</dd>
          </div>
          <div>
            <dt>Telephone</dt>
            <dd>{values.phone.trim()}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{values.email.trim()}</dd>
          </div>
        </dl>
        <div className="button-group">
          <button type="button" className="button button-primary" onClick={confirmBooking}>
            Confirm booking
          </button>
          <button type="button" className="button button-secondary" onClick={closeDialog}>
            Go back and edit
          </button>
        </div>
      </Modal>
    </>
  )
}
