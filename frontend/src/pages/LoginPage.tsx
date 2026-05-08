import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export function LoginPage() {
  const { demoUserId, setSessionUserId } = useAppContext();
  const [value, setValue] = useState(demoUserId);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!value.trim()) {
      setError('Demo user ID is required.');
      return;
    }
    setError('');
    setSessionUserId(value.trim());
    void navigate('/dashboard');
  }

  return (
    <main className="center-screen">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Demo access</h1>
        <p className="muted">Enter the seeded demo user ID from backend seed output.</p>
        <label>
          Demo user ID
          <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Paste x-demo-user-id" />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
