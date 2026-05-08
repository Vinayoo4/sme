import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/notifications', label: 'Notifications' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}
