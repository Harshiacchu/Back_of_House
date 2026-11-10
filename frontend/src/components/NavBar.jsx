import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js';
import './NavBar.css';

const LINKS = [
  { to: '/restaurants', label: 'Kitchen Reports' },
  { to: '/visits', label: 'Visit Log' },
  { to: '/polls', label: 'Group Picks' },
  { to: '/spots', label: 'My Spots' },
];

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <nav className="navbar__inner" aria-label="Main">
        <Link to="/" className="navbar__brand">
          Back of House
        </Link>
        <ul className="navbar__links">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className="navbar__link">
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="navbar__account">
          {user ? (
            <>
              <span className="navbar__user">{user.displayName}</span>
              <button
                type="button"
                className="navbar__action navbar__action--quiet"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar__action">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
