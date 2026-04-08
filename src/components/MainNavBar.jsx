import { Link } from 'react-router-dom';
import './MainNavBar.css';

const MainNavBar = () => {
  return (
    <nav className="main-navbar">
      <Link to="/" className="main-navbar-brand">
        🎓 CertTracker
      </Link>
      <div className="main-navbar-actions">
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
