import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavBar from './UserNavBar';
import { getCertificatesByUser, deleteCertificate, downloadCertificate } from '../api/certificate';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './UserTheme.css';

const ViewCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const data = await getCertificatesByUser(user.id);
      setCertificates(data);
    } catch (error) {
      if (error.response?.status === 204) {
        setCertificates([]);
      } else {
        toast.error('Error fetching certificates');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certId, certName) => {
    setDownloadingId(certId);
    try {
      const pdfBlob = await downloadCertificate(certId);
      
      // Create blob URL and download
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${certName}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('Certificate downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download certificate');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (certName) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        const response = await deleteCertificate(certName, user.id);
        toast.success(response);
        fetchCertificates();
      } catch (error) {
        toast.error(error.response?.data || 'Error deleting certificate');
      }
    }
  };

  const getCertificateTone = (certName = '', orgName = '') => {
    const seed = `${certName}${orgName}`.toLowerCase();
    if (seed.includes('azure') || seed.includes('microsoft')) return 'tone-blue';
    if (seed.includes('aws') || seed.includes('amazon')) return 'tone-indigo';
    if (seed.includes('google') || seed.includes('data')) return 'tone-teal';
    return 'tone-slate';
  };

  const getStatusText = (expiryDate) => {
    if (!expiryDate) return 'Expiry date unavailable';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Expired';
    if (diffDays <= 30) return `Expires in ${diffDays} days`;
    return `Valid till ${expiryDate}`;
  };

  return (
    <div className="user-page">
      <UserNavBar />
      <div className="user-shell">
        <h1 className="user-title">My Certificates</h1>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="user-cert-grid">
            {certificates.length === 0 ? (
              <p className="user-empty">No certificates found. Add your first certificate!</p>
            ) : (
              certificates.map((cert) => (
                <article key={cert.id} className="user-card user-cert-card">
                  <div className={`user-cert-preview ${getCertificateTone(cert.certName, cert.orgName)}`}>
                    <p className="user-cert-preview-label">Professional Certificate</p>
                    <h3 className="user-cert-preview-title">{cert.certName}</h3>
                    <div className="user-cert-preview-divider" />
                    <p className="user-cert-preview-meta">Issued by {cert.orgName}</p>
                  </div>

                  <div className="user-cert-body">
                    <p className="user-cert-line"><strong>Organization:</strong> {cert.orgName}</p>
                    <p className="user-cert-line"><strong>Issue Date:</strong> {cert.issueDate}</p>
                    <p className="user-cert-line"><strong>Expiry Date:</strong> {cert.expiryDate}</p>
                    <p className="user-cert-status">{getStatusText(cert.expiryDate)}</p>
                    <div className="user-btn-row user-cert-actions">
                      <button 
                        onClick={() => handleDownload(cert.id, cert.certName)} 
                        className="user-btn user-btn-info user-cert-action-btn"
                        disabled={downloadingId === cert.id}
                      >
                        {downloadingId === cert.id ? 'Downloading...' : '📥 Download'}
                      </button>
                      <button 
                        onClick={() => navigate(`/user/update-certificate/${cert.certName}`)} 
                        className="user-btn user-btn-success user-cert-action-btn">
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(cert.certName)} 
                        className="user-btn user-btn-danger user-cert-action-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCertificates;
