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
  const [certId, setCertId] = useState('');
  const [formData, setFormData] = useState({
    certName: '',
    orgName: '',
    issueDate: '',
    expiryDate: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        setCertId(cert.id);
        setFormData({
          certName: cert.certName,
          orgName: cert.orgName,
          issueDate: cert.issueDate,
          expiryDate: cert.expiryDate
        });
      }
    } catch (error) {
      toast.error('Error loading certificate');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setError('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      setFile(null);
      setError('Only PDF files are allowed');
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    if (!user?.id) {
      toast.error('User not found. Please login again.');
      return;
    }

    if (!certId) {
      toast.error('Certificate id not found. Please reopen the edit screen.');
      return;
    }

    if (!formData.certName.trim() || !formData.orgName.trim() || !formData.issueDate || !formData.expiryDate) {
      toast.error('Please fill all required fields');
      return;
    }

    const issueDate = new Date(formData.issueDate);
    const expiryDate = new Date(formData.expiryDate);
    if (Number.isNaN(issueDate.getTime()) || Number.isNaN(expiryDate.getTime())) {
      toast.error('Please enter valid dates');
      return;
    }

    if (expiryDate <= issueDate) {
      toast.error('Expiry date must be after issue date');
      return;
    }

    setLoading(true);
    try {
      const formDataPayload = new FormData();
      formDataPayload.append('id', certId);
      formDataPayload.append('certName', formData.certName);
      formDataPayload.append('orgName', formData.orgName);
      formDataPayload.append('issueDate', formData.issueDate);
      formDataPayload.append('expiryDate', formData.expiryDate);
      formDataPayload.append('userid', user.id);

      if (file) {
        formDataPayload.append('file', file);
      }

      const response = await updateCertificate(formDataPayload);
      toast.success(response || 'Certificate updated successfully');
      navigate('/user/view-certificates');
    } catch (submitError) {
      toast.error(submitError.response?.data || 'Failed to update certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-page user-page-update">
      <UserNavBar />
      <div className="user-shell user-form-wrap">
        <h1 className="user-title">Update Certificate</h1>
        <p className="user-subtitle">Maintain current validity and keep your credential details up to date.</p>
        <div className="user-card user-form-card user-form-card-update">
          <form onSubmit={handleUpdateSubmit}>
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

            <div className="user-field">
              <label>Replace Certificate PDF (Optional)</label>
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="user-input" />
              {error && <p className="user-error-text">{error}</p>}
            </div>
            <div className="user-btn-row">
              <button type="submit" className="user-btn user-btn-primary user-cert-action-btn" disabled={loading}>
                {loading ? 'Updating...' : 'Update Certificate'}
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
