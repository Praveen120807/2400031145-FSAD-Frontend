import { useState } from 'react';
import UserNavBar from './UserNavBar';
import { addCertificateWithFile } from '../api/certificate';
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
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    
    if (!file) {
      setFormData({ ...formData, file: null });
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      setFileError('Please upload a PDF file only');
      e.target.value = '';
      setFormData({ ...formData, file: null });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File size must be less than 5MB');
      e.target.value = '';
      setFormData({ ...formData, file: null });
      return;
    }

    setFormData({ ...formData, file });
  };

  const validateForm = () => {
    if (!formData.certName.trim()) {
      toast.error('Certificate name is required');
      return false;
    }
    if (!formData.orgName.trim()) {
      toast.error('Organization name is required');
      return false;
    }
    if (!formData.issueDate) {
      toast.error('Issue date is required');
      return false;
    }
    if (!formData.expiryDate) {
      toast.error('Expiry date is required');
      return false;
    }
    if (!formData.file) {
      toast.error('Please upload a PDF file');
      return false;
    }

    // Validate dates
    const issueDate = new Date(formData.issueDate);
    const expiryDate = new Date(formData.expiryDate);
    if (expiryDate <= issueDate) {
      toast.error('Expiry date must be after issue date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user ID exists
    if (!user?.id) {
      toast.error('User ID not found. Please logout and login again.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create FormData object
      const formDataObj = new FormData();
      formDataObj.append('certName', formData.certName);
      formDataObj.append('orgName', formData.orgName);
      formDataObj.append('issueDate', formData.issueDate);
      formDataObj.append('expiryDate', formData.expiryDate);
      formDataObj.append('userid', user.id);
      formDataObj.append('file', formData.file);

      const response = await addCertificateWithFile(formDataObj);
      toast.success(response || 'Certificate uploaded successfully');
      
      // Reset form
      setFormData({
        certName: '',
        orgName: '',
        issueDate: '',
        expiryDate: '',
        file: null
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Add certificate error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-page user-page-add">
      <UserNavBar />
      <div className="user-shell user-form-wrap">
        <h1 className="user-title">Add Certificate</h1>
        <p className="user-subtitle">Upload your certification with the PDF document to maintain a complete portfolio.</p>

        <div className="user-form-layout">
          <div className="user-card user-form-card user-form-card-add">
            <form onSubmit={handleSubmit}>
              <div className="user-form-section-title">Certificate Information</div>
              <div className="user-field">
                <label>Certificate Name *</label>
                <input 
                  type="text" 
                  name="certName" 
                  value={formData.certName} 
                  onChange={handleChange} 
                  required 
                  className="user-input" 
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>
              <div className="user-field">
                <label>Organization Name *</label>
                <input 
                  type="text" 
                  name="orgName" 
                  value={formData.orgName} 
                  onChange={handleChange} 
                  required 
                  className="user-input"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div className="user-form-section-title">Validity Timeline</div>
              <div className="user-field-row">
                <div className="user-field">
                  <label>Issue Date *</label>
                  <input 
                    type="date" 
                    name="issueDate" 
                    value={formData.issueDate} 
                    onChange={handleChange} 
                    required 
                    className="user-input" 
                  />
                </div>
                <div className="user-field">
                  <label>Expiry Date *</label>
                  <input 
                    type="date" 
                    name="expiryDate" 
                    value={formData.expiryDate} 
                    onChange={handleChange} 
                    required 
                    className="user-input" 
                  />
                </div>
              </div>

              <div className="user-form-section-title">Certificate Document</div>
              <div className="user-field">
                <label>Upload PDF File *</label>
                <div className="user-file-upload-wrapper">
                  <input 
                    type="file" 
                    name="file" 
                    onChange={handleFileChange} 
                    accept="application/pdf"
                    className="user-file-input"
                    disabled={loading}
                  />
                  <div className="user-file-upload-hint">
                    <p>Select a PDF file (max 5MB)</p>
                    {formData.file && (
                      <p className="user-file-selected">📄 {formData.file.name} ({(formData.file.size / 1024).toFixed(2)} KB)</p>
                    )}
                  </div>
                </div>
                {fileError && <p className="user-error-text">{fileError}</p>}
              </div>

              <button 
                type="submit" 
                className="user-btn user-btn-primary user-btn-block"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Add Certificate'}
              </button>
            </form>
          </div>

          <aside className="user-card user-helper-card user-helper-card-add">
            <h3>Submission Guide</h3>
            <p>Ensure your PDF certificate is properly formatted and complete.</p>
            <ul>
              <li>Use the official certification title.</li>
              <li>Set accurate issue and expiry dates.</li>
              <li>Upload a clear PDF of your certificate.</li>
              <li>Maximum file size is 5MB.</li>
              <li>Review details before submitting.</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AddCertificate;
