import { useCallback, useEffect, useState } from 'react';
import type { Notification } from '../api/notificationsApi';
import { fetchNotifications, markNotificationSeen } from '../api/notificationsApi';
import { NotificationsList } from '../components/notifications/NotificationsList';
import { useAppContext } from '../context/AppContext';

export function NotificationsPage() {
  const { refreshNotificationCount } = useAppContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchNotifications();
      setNotifications(response);
      await refreshNotificationCount();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [refreshNotificationCount]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  async function handleMarkSeen(id: string): Promise<void> {
    try {
      await markNotificationSeen(id);
      await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update notification');
    }
  }

  return (
    <section className="page stack">
      <h1>Notifications</h1>
      <NotificationsList notifications={notifications} loading={loading} error={error} onMarkSeen={handleMarkSeen} />
    </section>
  );
}
