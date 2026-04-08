import { useState } from 'react';
import UserNavBar from './UserNavBar';
import { addCertificate } from '../api/certificate';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './UserTheme.css';

const AddCertificate = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    certName: '',
    orgName: '',
    issueDate: '',
    expiryDate: '',
    certificateUrl: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user ID exists
    if (!user?.id) {
      toast.error('User ID not found. Please logout and login again.');
      return;
    }
    
    try {
      const certificateData = {
        certName: formData.certName,
        orgName: formData.orgName,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
        certificateUrl: formData.certificateUrl,
        user: { id: user.id }
      };
      console.log('Sending certificate data:', certificateData);
      const response = await addCertificate(certificateData);
      toast.success(response);
      setFormData({ certName: '', orgName: '', issueDate: '', expiryDate: '', certificateUrl: '' });
    } catch (error) {
      console.error('Add certificate error:', error);
      toast.error(error.response?.data || 'Failed to add certificate');
    }
  };

  return (
    <div className="user-page user-page-add">
      <UserNavBar />
      <div className="user-shell user-form-wrap">
        <h1 className="user-title">Add Certificate</h1>
        <p className="user-subtitle">Record certification details to maintain a complete and renewal-ready portfolio.</p>

        <div className="user-form-layout">
          <div className="user-card user-form-card user-form-card-add">
            <form onSubmit={handleSubmit}>
              <div className="user-form-section-title">Certificate Information</div>
              <div className="user-field">
                <label>Certificate Name</label>
                <input type="text" name="certName" value={formData.certName} onChange={handleChange} required className="user-input" />
              </div>
              <div className="user-field">
                <label>Organization Name</label>
                <input type="text" name="orgName" value={formData.orgName} onChange={handleChange} required className="user-input" />
              </div>

              <div className="user-form-section-title">Validity Timeline</div>
              <div className="user-field-row">
                <div className="user-field">
                  <label>Issue Date</label>
                  <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange} required className="user-input" />
                </div>
                <div className="user-field">
                  <label>Expiry Date</label>
                  <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required className="user-input" />
                </div>
              </div>

              <div className="user-form-section-title">Reference Link</div>
              <div className="user-field">
                <label>Certificate URL (Optional)</label>
                <input type="url" name="certificateUrl" value={formData.certificateUrl} onChange={handleChange} placeholder="https://example.com/certificate.pdf" className="user-input" />
              </div>

              <button type="submit" className="user-btn user-btn-primary user-btn-block">
                Add Certificate
              </button>
            </form>
          </div>

          <aside className="user-card user-helper-card user-helper-card-add">
            <h3>Submission Guide</h3>
            <p>Keep entries complete and consistent for better tracking and renewal reporting.</p>
            <ul>
              <li>Use the official certification title.</li>
              <li>Set accurate issue and expiry dates.</li>
              <li>Add a verification URL whenever available.</li>
              <li>Review details before submitting.</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AddCertificate;
