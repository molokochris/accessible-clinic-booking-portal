import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from './test/renderApp.jsx'

describe('App shell and navigation', () => {
  it('exposes the landmarks screen readers navigate by', () => {
    renderApp('/')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Footer' })).toBeInTheDocument()
    expect(screen.getByRole('search')).toBeInTheDocument()
  })

  it('has exactly one h1 per view', () => {
    renderApp('/')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('makes the skip link the first Tab stop and it targets main', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.tab()
    const skip = screen.getByRole('link', { name: 'Skip to main content' })
    expect(skip).toHaveFocus()
    expect(skip).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
  })

  it('does not steal focus on first load', () => {
    renderApp('/')
    expect(document.body).toHaveFocus()
  })

  it('moves focus to the new h1 and updates the title when the view changes', async () => {
    const user = userEvent.setup()
    renderApp('/')
    expect(document.title).toBe('Home | Poopedi Healthcare Clinic')

    await user.click(screen.getByRole('link', { name: 'Services' }))

    const heading = await screen.findByRole('heading', { level: 1, name: 'Available Clinic Services' })
    await waitFor(() => expect(heading).toHaveFocus())
    expect(document.title).toBe('Services | Poopedi Healthcare Clinic')
  })

  it('marks only the current page with aria-current', async () => {
    const user = userEvent.setup()
    renderApp('/')
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Services' })).not.toHaveAttribute('aria-current')

    await user.click(screen.getByRole('link', { name: 'Services' }))
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current')
  })

  it('carries a home page search through to the services list', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.type(screen.getByRole('searchbox', { name: /search clinical services/i }), 'asthma')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(
      await screen.findByText('Showing 1 result for “asthma”', { selector: '.results-status' }),
    ).toBeInTheDocument()
  })

  it('lets every card link be told apart by its name', () => {
    renderApp('/')
    const cardLinks = screen
      .getAllByRole('link')
      .filter((link) => /^(Book|Browse)/.test(link.textContent))
    const names = cardLinks.map((link) => link.textContent)
    expect(new Set(names).size).toBe(names.length)
  })

  it('shows a helpful page for unknown routes', () => {
    renderApp('/nowhere')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })
})
