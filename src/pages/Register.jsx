import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/user';
import { toast } from 'react-toastify';
import './AuthPages.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    email: '',
    username: '',
    password: '',
    Contact: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      toast.success(response);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-ambient auth-ambient-left" aria-hidden="true" />
      <div className="auth-ambient auth-ambient-right" aria-hidden="true" />

      <div className="auth-card auth-card-register">
        <div className="auth-header">
          <h2>🎓 CertTracker</h2>
          <p>Create your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" required className="auth-input" />
          </div>
          <div className="auth-field">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required className="auth-input">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required className="auth-input" />
          </div>
          <div className="auth-field">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter username" required className="auth-input" />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" required className="auth-input" />
          </div>
          <div className="auth-field">
            <label>Contact Number</label>
            <input type="text" name="Contact" value={formData.Contact} onChange={handleChange} placeholder="Enter contact number" required className="auth-input" />
          </div>
          <button type="submit" className="auth-btn auth-btn-primary auth-btn-register">
            Register
          </button>
          <button type="button" onClick={() => navigate('/')} className="auth-btn auth-btn-secondary">
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
