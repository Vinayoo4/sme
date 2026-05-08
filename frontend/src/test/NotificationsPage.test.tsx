import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppContext } from '../context/AppContext'
import { NotificationsPage } from '../pages/NotificationsPage'

vi.mock('../api/notificationsApi', () => ({
  fetchNotifications: vi.fn(),
  markNotificationSeen: vi.fn(),
}))

import { fetchNotifications, markNotificationSeen } from '../api/notificationsApi'

describe('NotificationsPage', () => {
  it('loads notifications and marks one as seen', async () => {
    const user = userEvent.setup()
    vi.mocked(fetchNotifications)
      .mockResolvedValueOnce([
        {
          id: 'note-1',
          businessId: 'biz-1',
          type: 'feedback.negative',
          message: 'New negative feedback needs attention',
          seen: false,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'note-1',
          businessId: 'biz-1',
          type: 'feedback.negative',
          message: 'New negative feedback needs attention',
          seen: true,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ])
    vi.mocked(markNotificationSeen).mockResolvedValue({
      id: 'note-1',
      businessId: 'biz-1',
      type: 'feedback.negative',
      message: 'New negative feedback needs attention',
      seen: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    })

    render(
      <AppContext.Provider
        value={{
          demoUserId: 'demo-user-123',
          setSessionUserId: vi.fn(),
          unseenNotifications: 1,
          refreshNotificationCount: vi.fn().mockResolvedValue(undefined),
        }}
      >
        <NotificationsPage />
      </AppContext.Provider>,
    )

    expect(await screen.findByText('New negative feedback needs attention')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mark as seen' }))

    await waitFor(() => {
      expect(markNotificationSeen).toHaveBeenCalledWith('note-1')
    })
  })
})
