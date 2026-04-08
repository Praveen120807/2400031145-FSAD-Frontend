import { Link } from 'react-router-dom';
import './MainNavBar.css';
import { useTheme } from '../context/ThemeContext';

const MainNavBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="main-navbar">
      <Link to="/" className="main-navbar-brand">
        <span className="main-navbar-logo" aria-hidden="true">CT</span>
        CertTracker
      </Link>
      <div className="main-navbar-actions">
        <button type="button" onClick={toggleTheme} className="main-navbar-theme-toggle">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <Link to="/login" className="main-navbar-btn main-navbar-btn-login">
          Login
        </Link>
        <Link to="/register" className="main-navbar-btn main-navbar-btn-register">
          Register
        </Link>
      </div>
    </nav>
  );
};

export default MainNavBar;
