import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import ToggleButton from './ToggleButton.jsx'

function Example() {
  const [pressed, setPressed] = useState(false)
  return (
    <ToggleButton pressed={pressed} onToggle={() => setPressed((value) => !value)}>
      Thursday 15 October
    </ToggleButton>
  )
}

describe('ToggleButton', () => {
  it('keeps aria-pressed in step with its state when clicked', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const button = screen.getByRole('button', { name: /thursday 15 october/i })

    expect(button).toHaveAttribute('aria-pressed', 'false')
    await user.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await user.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('toggles with Enter and Space', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const button = screen.getByRole('button', { name: /thursday 15 october/i })

    await user.tab()
    expect(button).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    await user.keyboard(' ')
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows a visible check mark when pressed, so state is not colour alone', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const button = screen.getByRole('button')

    expect(button).not.toHaveTextContent('✓')
    await user.click(button)
    expect(button).toHaveTextContent('✓')
  })
})
