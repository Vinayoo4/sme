import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { LoginPage } from '../pages/LoginPage'
import { describe, expect, it, vi } from 'vitest'

describe('LoginPage', () => {
  it('stores the demo user id through context on submit', async () => {
    const user = userEvent.setup()
    const setSessionUserId = vi.fn()

    render(
      <AppContext.Provider
        value={{
          demoUserId: '',
          setSessionUserId,
          unseenNotifications: 0,
          refreshNotificationCount: vi.fn().mockResolvedValue(undefined),
        }}
      >
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AppContext.Provider>,
    )

    await user.type(screen.getByPlaceholderText('Paste x-demo-user-id'), 'demo-user-123')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(setSessionUserId).toHaveBeenCalledWith('demo-user-123')
  })
})
