import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureAxe } from 'jest-axe'
import { describe, expect, it } from 'vitest'
import { renderApp } from './test/renderApp.jsx'

// jsdom has no layout or canvas, so axe cannot measure colour contrast here.
// Contrast is verified separately: ratios are computed from the palette (see
// the comments in main.css) and re-checked with Lighthouse in a real browser.
const axe = configureAxe({ rules: { 'color-contrast': { enabled: false } } })

const BOOKING = '/book/standard-gp-consultation'

async function expectNoViolations(container) {
  expect(await axe(container)).toHaveNoViolations()
}

describe('automated accessibility checks (axe-core)', () => {
  it('home page has no violations', async () => {
    const { container } = renderApp('/')
    await expectNoViolations(container)
  })

  it('services page has no violations', async () => {
    const { container } = renderApp('/services')
    await expectNoViolations(container)
  })

  it('services page has no violations with a filter group collapsed', async () => {
    const user = userEvent.setup()
    const { container } = renderApp('/services')
    await user.click(screen.getByRole('button', { name: /urgency level/i }))
    await expectNoViolations(container)
  })

  it('services empty state has no violations', async () => {
    const user = userEvent.setup()
    const { container } = renderApp('/services')
    await user.type(screen.getByRole('searchbox', { name: /search services/i }), 'zzzz')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    await expectNoViolations(container)
  })

  it('booking form has no violations', async () => {
    const { container } = renderApp(BOOKING)
    await expectNoViolations(container)
  })

  it('booking form error state has no violations', async () => {
    const user = userEvent.setup()
    const { container } = renderApp(BOOKING)
    await user.click(screen.getByRole('button', { name: 'Confirm appointment' }))
    await expectNoViolations(container)
  })

  it('booking confirmation dialog has no violations', async () => {
    const user = userEvent.setup()
    const { container } = renderApp(BOOKING)
    await user.type(screen.getByLabelText(/full name/i), 'Thandi Mokoena')
    await user.type(screen.getByLabelText(/telephone or mobile number/i), '012 345 6789')
    await user.type(screen.getByLabelText(/email address/i), 'thandi@example.com')
    await user.click(screen.getByLabelText(/i consent/i))
    await user.click(screen.getByRole('button', { name: 'Confirm appointment' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await expectNoViolations(container)
  })

  it('confirmation page has no violations', async () => {
    const booking = {
      reference: 'CC-TEST1',
      service: {
        title: 'Standard GP Consultation',
        practitioner: 'Dr. Sarah Jenkins',
        day: '2026-10-15',
        time: '09:30',
        room: 'Consulting Room 2B, Ground Floor',
      },
      name: 'Thandi Mokoena',
      phone: '012 345 6789',
      email: 'thandi@example.com',
    }
    const { container } = renderApp('/confirmation', { booking })
    await expectNoViolations(container)
  })

  it('booking without a service and the not-found page have no violations', async () => {
    const first = renderApp('/book')
    await expectNoViolations(first.container)
    first.unmount()

    const second = renderApp('/nowhere')
    await expectNoViolations(second.container)
  })
})
