import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaGraduationCap, FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = (p) => (loc.pathname === p ? 'nav-link active' : 'nav-link');

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <FaGraduationCap style={{ marginRight: 8, fontSize: 35, color: '#f59e0b' }} />
        LearnHub
      </Link>
      {/* Mobile menu toggle button */}
      <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
        {mobileOpen ? <FaTimes style={{ color: 'var(--text2)', fontSize: 22 }} /> : <FaBars style={{ color: 'var(--text2)', fontSize: 22 }} />}
      </button>
      <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
        <Link to="/" className={active('/')}>Courses</Link>
        {user?.role === 'student' && <Link to="/my-learning" className={active('/my-learning')}>My Learning</Link>}
        {user?.role === 'instructor' && <Link to="/dashboard" className={active('/dashboard')}>Dashboard</Link>}

        {/* Theme Toggle */}
        <button className="theme-toggle" onClick={toggle} title="Toggle theme">
          {theme === 'dark' ? <FaSun style={{ color: '#f59e0b', fontSize: 18 }} /> : <FaMoon style={{ color: '#f59e0b', fontSize: 18 }} />}
        </button>

        {user ? (
          <div className="nav-user">
            <span className={`badge ${user.role === 'instructor' ? 'badge-amber' : 'badge-blue'}`}>{user.role}</span>
            <span style={{ fontSize: 14, color: 'var(--text2)' }}>{user.name}</span>
            <button className="btn btn-outline btn-sm" onClick={() => { logoutUser(); navigate('/'); }}>Logout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
