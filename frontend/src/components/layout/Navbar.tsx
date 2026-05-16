import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export function Navbar() {
  const { unseenNotifications, userId } = useAppContext();

  return (
    <header className="topbar">
      <div>
        <strong>SME Ops</strong>
        <p className="muted">Operations Platform</p>
      </div>
      <nav className="topbar-actions">
        <Link to="/notifications">Notifications ({unseenNotifications})</Link>
        <span className="session-chip">User: {userId || 'not set'}</span>
      </nav>
    </header>
  );
}
