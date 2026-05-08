import { useState } from 'react';
import type { FormEvent } from 'react';
import type { FeedbackPayload } from '../../api/feedbackApi';

interface FeedbackCaptureProps {
  onSubmit: (payload: FeedbackPayload) => Promise<void>;
  busy: boolean;
}

export function FeedbackCapture({ onSubmit, busy }: FeedbackCaptureProps) {
  const [form, setForm] = useState<FeedbackPayload>({ rating: 5, serviceType: '', staffName: '', customerPhone: '', transcript: '' });
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!form.transcript?.trim()) {
      setError('Transcript is required.');
      return;
    }
    setError('');
    await onSubmit(form);
    setForm({ rating: 5, serviceType: '', staffName: '', customerPhone: '', transcript: '' });
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>Capture feedback</h2>
      <label>
        Rating
        <select value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>
      <label>
        Service type
        <input value={form.serviceType ?? ''} onChange={(event) => setForm((current) => ({ ...current, serviceType: event.target.value }))} />
      </label>
      <label>
        Staff name
        <input value={form.staffName ?? ''} onChange={(event) => setForm((current) => ({ ...current, staffName: event.target.value }))} />
      </label>
      <label>
        Customer phone
        <input value={form.customerPhone ?? ''} onChange={(event) => setForm((current) => ({ ...current, customerPhone: event.target.value }))} />
      </label>
      <label className="full-width">
        Transcript
        <textarea value={form.transcript ?? ''} onChange={(event) => setForm((current) => ({ ...current, transcript: event.target.value }))} rows={4} />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save feedback'}</button>
    </form>
  );
}
