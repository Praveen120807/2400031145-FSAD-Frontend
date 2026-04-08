import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserNavBar from './UserNavBar';
import { updateCertificate, getCertificatesByUser } from '../api/certificate';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './UserTheme.css';

const UpdateCertificate = () => {
  const { certName } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    certName: '',
    orgName: '',
    issueDate: '',
    expiryDate: '',
    certificateUrl: ''
  });

  useEffect(() => {
    if (user?.id && certName) {
      fetchCertificate();
    }
  }, [user, certName]);

  const fetchCertificate = async () => {
    try {
      const data = await getCertificatesByUser(user.id);
      const cert = data.find(c => c.certName === decodeURIComponent(certName));
      if (cert) {
        setFormData({
          certName: cert.certName,
          orgName: cert.orgName,
          issueDate: cert.issueDate,
          expiryDate: cert.expiryDate,
          certificateUrl: cert.certificateUrl || ''
        });
      }
    } catch (error) {
      toast.error('Error loading certificate');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const certificateData = {
        ...formData,
        user: { id: user.id }
      };
      const response = await updateCertificate(certificateData);
      toast.success(response);
      setTimeout(() => navigate('/user/view-certificates'), 1500);
    } catch (error) {
      toast.error(error.response?.data || 'Failed to update certificate');
    }
  };

  return (
    <div className="user-page user-page-update">
      <UserNavBar />
      <div className="user-shell user-form-wrap">
        <h1 className="user-title">Update Certificate</h1>
        <p className="user-subtitle">Maintain current validity and keep your credential details up to date.</p>
        <div className="user-card user-form-card user-form-card-update">
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
            <div className="user-btn-row">
              <button type="submit" className="user-btn user-btn-primary user-cert-action-btn">
                Update Certificate
              </button>
              <button type="button" onClick={() => navigate('/user/view-certificates')} className="user-btn user-btn-secondary user-cert-action-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCertificate;
