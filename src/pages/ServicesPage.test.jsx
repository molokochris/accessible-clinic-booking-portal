import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp.jsx'

const status = (text) => screen.getByText(text, { selector: '.results-status' })

describe('ServicesPage', () => {
  it('lists the first page of results with a results count and page position', () => {
    renderApp('/services')

    expect(status('Showing 12 results')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(4)
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
  })

  it('gives every Book link a unique, descriptive name', () => {
    renderApp('/services')
    const names = screen
      .getAllByRole('link', { name: /^Book /i })
      .map((link) => link.textContent)
    expect(names.length).toBeGreaterThan(1)
    expect(new Set(names).size).toBe(names.length)
  })

  it('filters by a checkbox only after "Apply filters" and updates the status text', async () => {
    const user = userEvent.setup()
    renderApp('/services')

    await user.click(screen.getByRole('checkbox', { name: 'Same-day triage' }))
    // nothing changes until the filters are applied
    expect(status('Showing 12 results')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Apply filters' }))
    expect(status('Showing 3 results with 1 filter applied')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('filters with aria-pressed day toggles', async () => {
    const user = userEvent.setup()
    renderApp('/services')
    const friday = screen.getByRole('button', { name: /friday 16 october/i })

    expect(friday).toHaveAttribute('aria-pressed', 'false')
    await user.click(friday)
    expect(friday).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Apply filters' }))
    expect(status('Showing 6 results with 1 filter applied')).toBeInTheDocument()
  })

  it('collapses a filter group and keeps aria-expanded correct', async () => {
    const user = userEvent.setup()
    renderApp('/services')
    const trigger = screen.getByRole('button', { name: /service type/i })

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('checkbox', { name: 'Pharmacy' })).toBeVisible()

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('checkbox', { name: 'Pharmacy' })).not.toBeInTheDocument()
  })

  it('searches by text', async () => {
    const user = userEvent.setup()
    renderApp('/services')

    await user.type(screen.getByRole('searchbox', { name: /search services/i }), 'asthma')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(status('Showing 1 result for “asthma”')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })

  it('starts from a category in the URL', () => {
    renderApp('/services?type=nursing')
    expect(status('Showing 2 results with 1 filter applied')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /nursing/i })).toBeChecked()
  })

  it('shows an empty state and recovers with keyboard focus on the search box', async () => {
    const user = userEvent.setup()
    renderApp('/services')
    const search = screen.getByRole('searchbox', { name: /search services/i })

    await user.type(search, 'zzzz')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(status('Showing 0 results for “zzzz”')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /no clinic services match/i }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /clear search and filters/i }))
    expect(status('Showing 12 results')).toBeInTheDocument()
    expect(search).toHaveFocus()
    expect(search).toHaveValue('')
  })

  it('moves focus to the results heading and announces the page on pagination', async () => {
    const user = userEvent.setup()
    renderApp('/services')

    await user.click(screen.getByRole('button', { name: 'Next' }))

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Search results' })).toHaveFocus()
    await waitFor(() =>
      expect(screen.getByTestId('announcer')).toHaveTextContent('Page 2 of 3'),
    )
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled()
  })

  it('wraps pagination in a labelled navigation landmark', () => {
    renderApp('/services')
    const nav = screen.getByRole('navigation', { name: 'Pagination' })
    expect(within(nav).getByText('Page 1 of 3')).toBeInTheDocument()
  })
})
