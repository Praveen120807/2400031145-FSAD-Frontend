import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminTheme.css';
import { useTheme } from '../context/ThemeContext';

const AdminNavBar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="admin-nav">
      <div className="admin-nav-brand">
        <span className="admin-nav-logo" aria-hidden="true">CT</span>
        Admin Panel
      </div>
      <div className="admin-nav-links">
        <Link to="/admin/home" className="admin-nav-link">Home</Link>
        <Link to="/admin/users" className="admin-nav-link">View All Users</Link>
        <Link to="/admin/certificates" className="admin-nav-link">View All Certificates</Link>
        <button type="button" onClick={toggleTheme} className="admin-nav-theme-toggle">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <button onClick={handleLogout} className="admin-nav-logout">Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavBar;
