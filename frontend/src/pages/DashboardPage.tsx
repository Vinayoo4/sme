import { useEffect, useMemo, useState } from 'react';
import type { Feedback } from '../api/feedbackApi';
import { fetchFeedback } from '../api/feedbackApi';
import type { RestockSuggestion } from '../api/inventoryApi';
import { fetchRestockSuggestions } from '../api/inventoryApi';
import type { Notification } from '../api/notificationsApi';
import { fetchNotifications } from '../api/notificationsApi';
import { getJson } from '../api/client';
import { useAppContext } from '../context/AppContext';

interface ExportResponse {
  data: Record<string, unknown>;
}

export function DashboardPage() {
  const { refreshNotificationCount } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [feedbackTotal, setFeedbackTotal] = useState(0);
  const [restock, setRestock] = useState<RestockSuggestion[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void (async () => {
        setLoading(true);
        setError('');
        try {
          const [feedbackResponse, restockResponse, notificationResponse] = await Promise.all([
            fetchFeedback(1, 5),
            fetchRestockSuggestions(),
            fetchNotifications(),
          ]);
          setFeedback(feedbackResponse.data);
          setFeedbackTotal(feedbackResponse.total);
          setRestock(restockResponse.filter((item) => item.suggestedOrder > 0));
          setNotifications(notificationResponse.slice(0, 3));
          await refreshNotificationCount();
        } catch (loadError) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard');
        } finally {
          setLoading(false);
        }
      })();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [refreshNotificationCount]);

  const unseenCount = useMemo(() => notifications.filter((notification) => !notification.seen).length, [notifications]);

  async function handleExport(): Promise<void> {
    try {
      setExporting(true);
      const payload = await getJson<ExportResponse>('/api/export/all');
      const blob = new Blob([JSON.stringify(payload.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sme-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return <section className="page"><div className="card"><p>Loading dashboard...</p></div></section>;
  }
  if (error) {
    return <section className="page"><div className="card"><p className="error">{error}</p></div></section>;
  }

  return (
    <section className="page stack">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Action summary for the current business.</p>
        </div>
        <button type="button" onClick={() => void handleExport()} disabled={exporting}>{exporting ? 'Exporting...' : 'Export all JSON'}</button>
      </div>
      <div className="stats-grid">
        <article className="card"><h2>{feedbackTotal}</h2><p>Total feedback</p></article>
        <article className="card"><h2>{restock.length}</h2><p>Products needing restock</p></article>
        <article className="card"><h2>{unseenCount}</h2><p>Unseen notifications</p></article>
      </div>
      <div className="content-grid">
        <section className="card stack">
          <h2>Recent feedback</h2>
          {feedback.length ? feedback.map((item) => <p key={item.id}>{item.transcript || 'No transcript'} ({item.rating ?? '-'}/5)</p>) : <p className="muted">No feedback yet.</p>}
        </section>
        <section className="card stack">
          <h2>Recent notifications</h2>
          {notifications.length ? notifications.map((item) => <p key={item.id}>{item.message}</p>) : <p className="muted">No notifications yet.</p>}
        </section>
      </div>
    </section>
  );
}
