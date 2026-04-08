import { useState } from 'react';
import UserNavBar from './UserNavBar';
import { updateUserProfile } from '../api/user';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './UserTheme.css';

const UserProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    id: user?.id || '',
    name: '',
    gender: '',
    email: '',
    username: user?.username || '',
    password: '',
    Contact: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile(formData);
      toast.success(response);
    } catch (error) {
      toast.error(error.response?.data || 'Update failed');
    }
  };

  return (
    <div className="user-page user-page-profile">
      <UserNavBar />
      <div className="user-shell user-form-wrap">
        <h1 className="user-title">Update Profile</h1>
        <p className="user-subtitle">Keep your account profile current for accurate communication and account security.</p>
        <div className="user-card user-form-card user-form-card-profile">
          <form onSubmit={handleSubmit}>
            <div className="user-form-section-title">Personal Details</div>
            <div className="user-field">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="user-input" />
            </div>
            <div className="user-field">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required className="user-input">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="user-form-section-title">Account Details</div>
            <div className="user-field">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="user-input" />
            </div>
            <div className="user-field">
              <label>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required className="user-input" />
            </div>
            <div className="user-field">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current password" className="user-input" />
            </div>
            <div className="user-field">
              <label>Contact Number</label>
              <input type="text" name="Contact" value={formData.Contact} onChange={handleChange} required className="user-input" />
            </div>
            <button type="submit" className="user-btn user-btn-primary user-btn-block">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
