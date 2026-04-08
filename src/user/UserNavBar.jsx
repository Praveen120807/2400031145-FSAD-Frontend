import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserTheme.css';
import { useTheme } from '../context/ThemeContext';

const UserNavBar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="user-nav">
      <div className="user-nav-brand">
        <span className="user-nav-logo" aria-hidden="true">CT</span>
        CertTracker
      </div>
      <div className="user-nav-links">
        <Link to="/user/home" className="user-nav-link">Home</Link>
        <Link to="/user/add-certificate" className="user-nav-link">Add Certificate</Link>
        <Link to="/user/view-certificates" className="user-nav-link">My Certificates</Link>
        <Link to="/user/profile" className="user-nav-link">Profile</Link>
        <button type="button" onClick={toggleTheme} className="user-nav-theme-toggle">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <button onClick={handleLogout} className="user-nav-logout">Logout</button>
      </div>
    </nav>
  );
};

export default UserNavBar;
