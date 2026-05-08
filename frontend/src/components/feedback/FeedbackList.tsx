import type { Feedback } from '../../api/feedbackApi';

interface FeedbackListProps {
  feedback: Feedback[];
  loading: boolean;
  error: string;
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function FeedbackList({ feedback, loading, error, page, total, limit, onPageChange }: FeedbackListProps) {
  if (loading) {
    return <section className="card"><p>Loading feedback...</p></section>;
  }
  if (error) {
    return <section className="card"><p className="error">{error}</p></section>;
  }
  if (!feedback.length) {
    return <section className="card"><p className="muted">No feedback yet.</p></section>;
  }

  const maxPage = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="card">
      <div className="card-header">
        <h2>Feedback list</h2>
        <p className="muted">Page {page} of {maxPage}</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rating</th>
              <th>Sentiment</th>
              <th>Service</th>
              <th>Staff</th>
              <th>Transcript</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((item) => (
              <tr key={item.id}>
                <td>{item.rating ?? '-'}</td>
                <td>{item.sentiment ?? '-'}</td>
                <td>{item.serviceType ?? '-'}</td>
                <td>{item.staffName ?? '-'}</td>
                <td>{item.transcript ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-actions">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
        <button type="button" disabled={page >= maxPage} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </section>
  );
}
