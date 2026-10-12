import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle.js'

const STATS = [
  { label: 'Clinics', value: '6 core clinics', note: 'Fully staffed on-site facilities' },
  {
    label: 'Operating hours',
    value: '08:00 – 18:30',
    note: 'Monday to Friday consultation schedule',
  },
  {
    label: 'Accessibility',
    value: 'Step-free access',
    note: 'Wheelchair ramps and hearing loops available',
  },
]

const CARDS = [
  {
    title: 'Standard GP Consultation',
    details: ['Clinician: Dr. Sarah Jenkins', 'Thursday 15 October, 09:30'],
    to: '/book/standard-gp-consultation',
    linkText: 'Book GP consultation',
  },
  {
    title: 'Community Nursing',
    details: ['Post-operative wound dressing, catheter changes, and injections.'],
    to: '/services?type=nursing',
    linkText: 'Browse nursing appointments',
  },
  {
    title: 'Mental Health Support',
    details: ['Psychological wellbeing practitioners and counselling referrals.'],
    to: '/services?type=mental',
    linkText: 'Browse mental health appointments',
  },
  {
    title: 'Clinical Pharmacy',
    details: ['Medication reviews, repeat prescriptions, and prescription consultations.'],
    to: '/services?type=pharmacy',
    linkText: 'Browse pharmacy services',
  },
  {
    title: 'Child & Family Health',
    details: ['Childhood immunisations and developmental milestone reviews.'],
    to: '/services?type=child',
    linkText: 'Browse child and family health',
  },
  {
    title: 'Chronic Condition Care',
    details: ['Routine management for diabetes, asthma, and hypertension.'],
    to: '/services?type=chronic',
    linkText: 'Browse chronic condition care',
  },
]

export default function HomePage() {
  usePageTitle('Home')
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (event) => {
    event.preventDefault()
    const text = query.trim()
    navigate({ pathname: '/services', search: text ? `?q=${encodeURIComponent(text)}` : '' })
  }

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Accessible Community Healthcare Clinic</h1>
        <p>
          Comprehensive primary care, diagnostic clinics, and routine health appointments for
          local residents.
        </p>
        <div className="button-group">
          <Link className="button button-primary" to="/services">
            Find an appointment
          </Link>
          <a className="button button-secondary" href="#location-title">
            Clinic guide
          </a>
        </div>

        <ul className="stats">
          {STATS.map((stat) => (
            <li key={stat.label}>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
              <p>{stat.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <form className="search" role="search" onSubmit={handleSearch}>
        <label htmlFor="home-search">Search clinical services or symptoms</label>
        <div className="search-row">
          <input
            type="search"
            id="home-search"
            name="q"
            placeholder="e.g. asthma review"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="button button-secondary">
            Search
          </button>
        </div>
      </form>

      <div className="services">
        <section className="clinical-services" aria-labelledby="services-title">
          <h2 id="services-title">Clinical Services</h2>
          <ul className="service-cards">
            {CARDS.map((card) => (
              <li key={card.title}>
                <article>
                  <h3>{card.title}</h3>
                  {card.details.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <Link to={card.to}>{card.linkText}</Link>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <div className="side-panels">
          <section className="urgent" aria-labelledby="urgent-title">
            <h2 id="urgent-title">Urgent Care &amp; Emergency</h2>
            <p>
              For acute life-threatening emergencies dial <strong>999</strong> immediately. For
              urgent clinical triage call{' '}
              <a href="tel:08000119200">
                <strong>0800 011 9200</strong>
              </a>
              .
            </p>
            <p>Walk-in urgent review is subject to primary triage assessment.</p>
          </section>

          <section className="status" aria-labelledby="status-title">
            <h2 id="status-title">Clinic Status</h2>
            <p>
              <strong>Operating status:</strong> Doors open until 18:30
            </p>
            <p>
              <strong>Next available slot:</strong> Thursday 15 October, 09:30 with Dr. Sarah
              Jenkins
            </p>
            <Link className="button button-secondary" to="/services">
              Check triage queue
            </Link>
          </section>
        </div>
      </div>

      <section className="location-section" aria-labelledby="location-title">
        <h2 id="location-title" tabIndex={-1}>
          Clinic Location &amp; Physical Access
        </h2>
        <div className="location-grid">
          <div
            className="location-map"
            role="img"
            aria-label="Map of the clinic location and access ramp (placeholder)"
          >
            [ Map placeholder: clinic location &amp; access ramp ]
          </div>
          <div className="address-info">
            <h3>Address &amp; arrival</h3>
            <address>
              Council Central Health Centre
              <br />
              100 Civic Parade, Suite 4
              <br />
              Healthcare District, HC1 2AB
            </address>

            <h3>Access instructions</h3>
            <p>
              Dedicated step-free access ramp located at the East entrance. Automated doors, wide
              corridors, and low-counter reception desks are fitted throughout.
            </p>

            <h3>Public transit &amp; parking</h3>
            <p>
              Bus lines 4, 12, and 45 stop outside Civic Parade. Six designated accessible parking
              bays are available in the North Lot.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
