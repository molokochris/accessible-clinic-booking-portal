import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import FilterGroup from './FilterGroup.jsx'

function setup() {
  render(
    <FilterGroup id="urgency" title="Urgency level">
      <label>
        <input type="checkbox" /> Routine
      </label>
    </FilterGroup>,
  )
  return {
    user: userEvent.setup(),
    trigger: screen.getByRole('button', { name: /urgency level/i }),
  }
}

describe('FilterGroup (accordion)', () => {
  it('starts expanded and points aria-controls at its panel', () => {
    const { trigger } = setup()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const panelId = trigger.getAttribute('aria-controls')
    expect(document.getElementById(panelId)).toBeVisible()
    expect(screen.getByRole('checkbox', { name: /routine/i })).toBeVisible()
  })

  it('updates aria-expanded and hides the panel when clicked', async () => {
    const { user, trigger } = setup()
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById(trigger.getAttribute('aria-controls'))).not.toBeVisible()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('toggles with the Enter and Space keys', async () => {
    const { user, trigger } = setup()
    await user.tab()
    expect(trigger).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.keyboard(' ')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })
})
