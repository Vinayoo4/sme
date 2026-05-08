import { useCallback, useEffect, useState } from 'react';
import type { Feedback, FeedbackPayload } from '../api/feedbackApi';
import { createFeedback, fetchFeedback } from '../api/feedbackApi';
import { FeedbackCapture } from '../components/feedback/FeedbackCapture';
import { FeedbackList } from '../components/feedback/FeedbackList';
import { useAppContext } from '../context/AppContext';

export function FeedbackPage() {
  const { refreshNotificationCount } = useAppContext();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const limit = 10;

  const load = useCallback(async (nextPage = page): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchFeedback(nextPage, limit);
      setFeedback(response.data);
      setTotal(response.total);
      setPage(nextPage);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load(1);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  async function handleCreate(payload: FeedbackPayload): Promise<void> {
    try {
      setSaving(true);
      await createFeedback(payload);
      await load(1);
      await refreshNotificationCount();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save feedback');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page stack">
      <h1>Feedback</h1>
      <FeedbackCapture onSubmit={handleCreate} busy={saving} />
      <FeedbackList feedback={feedback} loading={loading} error={error} page={page} total={total} limit={limit} onPageChange={(nextPage) => void load(nextPage)} />
    </section>
  );
}
