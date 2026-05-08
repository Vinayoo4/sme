import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export function Navbar() {
  const { unseenNotifications, demoUserId } = useAppContext();

  return (
    <header className="topbar">
      <div>
        <strong>SME Ops</strong>
        <p className="muted">JSON-file NoSQL workspace</p>
      </div>
      <nav className="topbar-actions">
        <Link to="/notifications">Notifications ({unseenNotifications})</Link>
        <span className="session-chip">Demo user: {demoUserId || 'not set'}</span>
      </nav>
    </header>
  );
}
