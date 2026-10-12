import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp.jsx'

const ROUTE = '/book/standard-gp-consultation'

const field = {
  name: () => screen.getByLabelText(/full name/i),
  phone: () => screen.getByLabelText(/telephone or mobile number/i),
  email: () => screen.getByLabelText(/email address/i),
  consent: () => screen.getByLabelText(/i consent/i),
  submit: () => screen.getByRole('button', { name: 'Confirm appointment' }),
}

async function fillValidForm(user) {
  await user.type(field.name(), 'Thandi Mokoena')
  await user.type(field.phone(), '012 345 6789')
  await user.type(field.email(), 'thandi@example.com')
  await user.click(field.consent())
}

describe('BookingPage form', () => {
  it('associates every control with a label, and hints with aria-describedby', () => {
    renderApp(ROUTE)

    expect(field.name()).toHaveAccessibleDescription(/as shown on your id/i)
    expect(field.phone()).toHaveAccessibleDescription(/appointment reminders/i)
    expect(field.email()).toHaveAccessibleDescription(/confirmation will be sent/i)
    expect(screen.getByLabelText(/reason for visit/i)).toHaveAccessibleDescription(
      /do not enter emergency information/i,
    )
    expect(field.name()).toBeRequired()
    expect(screen.getByLabelText(/reason for visit/i)).not.toBeRequired()
    expect(field.name()).toHaveAttribute('autocomplete', 'name')
    expect(field.phone()).toHaveAttribute('autocomplete', 'tel')
    expect(field.email()).toHaveAttribute('autocomplete', 'email')
  })

  it('shows "(required)" and "(optional)" as text', () => {
    renderApp(ROUTE)
    expect(screen.getAllByText('(required)').length).toBeGreaterThanOrEqual(4)
    expect(screen.getByText('(optional)')).toBeInTheDocument()
  })

  it('marks fields invalid and moves focus to the error summary on a failed submit', async () => {
    const user = userEvent.setup()
    renderApp(ROUTE)

    await user.click(field.submit())

    const summary = screen.getByRole('region', { name: /problems with your submission/i })
    expect(summary).toHaveFocus()
    expect(summary).toHaveTextContent('There are 4 problems')

    expect(field.name()).toHaveAttribute('aria-invalid', 'true')
    expect(field.name()).toHaveAccessibleDescription(/error: enter your full name/i)
    expect(field.phone()).toHaveAttribute('aria-invalid', 'true')
    expect(field.email()).toHaveAttribute('aria-invalid', 'true')
    expect(field.consent()).toHaveAttribute('aria-invalid', 'true')
  })

  it('moves focus to the matching field from an error summary link', async () => {
    const user = userEvent.setup()
    renderApp(ROUTE)
    await user.click(field.submit())

    await user.click(screen.getByRole('link', { name: /telephone or mobile number: enter a telephone/i }))
    expect(field.phone()).toHaveFocus()
  })

  it('validates on blur and announces the outcome in a polite live region', async () => {
    const user = userEvent.setup()
    renderApp(ROUTE)
    const live = screen.getByTestId('announcer')
    expect(live).toHaveAttribute('aria-live', 'polite')

    await user.click(field.phone())
    await user.type(field.phone(), '012')
    await user.tab()

    expect(field.phone()).toHaveAttribute('aria-invalid', 'true')
    await waitFor(() => expect(live).toHaveTextContent(/telephone or mobile number: enter a valid/i))
  })

  it('clears the error and announces when the user fixes a field', async () => {
    const user = userEvent.setup()
    renderApp(ROUTE)
    const live = screen.getByTestId('announcer')

    await user.click(field.name())
    await user.tab() // blur an empty required field
    expect(field.name()).toHaveAttribute('aria-invalid', 'true')

    await user.type(field.name(), 'Thandi Mokoena')
    expect(field.name()).toHaveAttribute('aria-invalid', 'false')
    await waitFor(() => expect(live).toHaveTextContent('Full name is now valid.'))
  })

  it('opens a confirmation dialog on a valid submit and moves focus into it', async () => {
    const user = userEvent.setup()
    renderApp(ROUTE)
    await fillValidForm(user)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(field.submit())

    const dialog = screen.getByRole('dialog', { name: /check your appointment/i })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /check your appointment/i })).toHaveFocus()
    expect(dialog).toHaveTextContent('Thandi Mokoena')
  })

  it('closes the dialog with Escape (cancel) and returns focus to the submit button', async () => {
    const user = userEvent.setup()
    renderApp(ROUTE)
    await fillValidForm(user)
    await user.click(field.submit())

    const dialog = screen.getByRole('dialog')
    fireEvent(dialog, new Event('cancel', { cancelable: true }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(field.submit()).toHaveFocus()
  })

  it('closes the dialog with "Go back and edit" and keeps the typed values', async () => {
    const user = userEvent.setup()
    renderApp(ROUTE)
    await fillValidForm(user)
    await user.click(field.submit())

    await user.click(screen.getByRole('button', { name: /go back and edit/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(field.name()).toHaveValue('Thandi Mokoena')
    expect(field.submit()).toHaveFocus()
  })

  it('completes the booking: confirmation view takes focus and shows a reference', async () => {
    const user = userEvent.setup()
    renderApp(ROUTE)
    await fillValidForm(user)
    await user.click(field.submit())
    await user.click(screen.getByRole('button', { name: 'Confirm booking' }))

    const heading = await screen.findByRole('heading', { level: 1, name: 'Appointment confirmed' })
    expect(heading).toHaveFocus()
    expect(screen.getByText(/^CC-[A-Z0-9]+$/)).toBeInTheDocument()
    expect(document.title).toBe('Appointment confirmed | Poopedi Healthcare Clinic')
  })
})

describe('BookingPage without a valid service', () => {
  it('asks the visitor to choose a service first', () => {
    renderApp('/book')
    expect(screen.getByRole('heading', { level: 1, name: 'Book an appointment' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /browse clinic services/i })).toHaveAttribute('href', '/services')
  })

  it('explains when a service id does not exist', () => {
    renderApp('/book/not-a-service')
    expect(screen.getByText(/could not find that service/i)).toBeInTheDocument()
  })
})
