import type { Notification } from '../../api/notificationsApi';

interface NotificationsListProps {
  notifications: Notification[];
  loading: boolean;
  error: string;
  onMarkSeen: (id: string) => Promise<void>;
}

export function NotificationsList({ notifications, loading, error, onMarkSeen }: NotificationsListProps) {
  if (loading) {
    return <section className="card"><p>Loading notifications...</p></section>;
  }
  if (error) {
    return <section className="card"><p className="error">{error}</p></section>;
  }
  if (!notifications.length) {
    return <section className="card"><p className="muted">No notifications yet.</p></section>;
  }

  return (
    <section className="card stack">
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification.id} className="notification-row">
          <div>
            <strong>{notification.message}</strong>
            <p className="muted">{new Date(notification.createdAt).toLocaleString()}</p>
          </div>
          {notification.seen ? <span className="badge muted-badge">Seen</span> : <button type="button" onClick={() => void onMarkSeen(notification.id)}>Mark as seen</button>}
        </div>
      ))}
    </section>
  );
}
