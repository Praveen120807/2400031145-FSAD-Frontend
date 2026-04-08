import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../api/auth';
import { getUserByUsername } from '../api/user';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginAPI(username, password);
      const responseMessage = response;

      if (role === 'admin' && responseMessage.includes('User')) {
        toast.error('Invalid Admin Credentials');
      } else if (role === 'user' && responseMessage.includes('Admin')) {
        toast.error('Invalid User Credentials');
      } else {
        // Fetch user details to get the ID
        if (role === 'user') {
          try {
            const userDetails = await getUserByUsername(username);
            login(userDetails, role);
          } catch (error) {
            login({ username }, role);
          }
        } else {
          login({ username }, role);
        }
        toast.success(responseMessage);
        setTimeout(() => {
          navigate(role === 'admin' ? '/admin/home' : '/user/home');
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-ambient auth-ambient-left" aria-hidden="true" />
      <div className="auth-ambient auth-ambient-right" aria-hidden="true" />

      <div className="auth-card">
        <div className="auth-header">
          <h2>🎓 CertTracker</h2>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="auth-field">
            <label>Login As</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="auth-input"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <button type="submit" className="auth-btn auth-btn-primary">
            Login
          </button>
          <button type="button" onClick={() => navigate('/')} className="auth-btn auth-btn-secondary">
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
