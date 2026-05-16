import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export function LoginPage() {
  const { userId, setUserId } = useAppContext();
  const [value, setValue] = useState(userId);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!value.trim()) {
      setError('User ID is required.');
      return;
    }
    setError('');
    setUserId(value.trim());
    void navigate('/dashboard');
  }

  return (
    <main className="center-screen">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <p className="muted">Enter your user ID to access the platform.</p>
        <label>
          User ID
          <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Enter your user ID" />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
