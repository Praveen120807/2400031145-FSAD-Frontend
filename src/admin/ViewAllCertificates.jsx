import { useState, useEffect } from 'react';
import AdminNavBar from './AdminNavBar';
import { getAllCertificates } from '../api/admin';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import './AdminTheme.css';

const ViewAllCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCerts, setFilteredCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCerts(certificates);
    } else {
      const filtered = certificates.filter(cert => 
        cert.certName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCerts(filtered);
    }
  }, [searchTerm, certificates]);

  const fetchCertificates = async () => {
    try {
      const data = await getAllCertificates();
      setCertificates(data);
      setFilteredCerts(data);
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.response?.status === 204) {
        setCertificates([]);
        setFilteredCerts([]);
      } else {
        toast.error(error.response?.data || 'Error fetching certificates');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminNavBar />
      <div className="admin-shell">
        <h1 className="admin-title">All Certificates</h1>
        <p className="admin-section-note">
          Review certificate records, search by certificate or user, and keep expiry data easy to scan.
        </p>
        
        <div className="admin-search-wrap">
          <input 
            type="text" 
            placeholder="Search by certificate name, organization, or user..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search"
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="admin-table-wrap">
            <div className="admin-table-meta">
              <span className="admin-table-chip">{filteredCerts.length} records</span>
              <span className="admin-table-chip admin-table-chip-soft">Certificate registry</span>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Certificate Name</th>
                  <th>Organization</th>
                  <th>User</th>
                  <th>Issue Date</th>
                  <th>Expiry Date</th>
                  <th>Added At</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="admin-empty">
                      {searchTerm ? 'No certificates found matching your search' : 'No certificates found'}
                    </td>
                  </tr>
                ) : (
                  filteredCerts.map((cert) => (
                    <tr key={cert.id}>
                      <td>{cert.id}</td>
                      <td>{cert.certName}</td>
                      <td>{cert.orgName}</td>
                      <td>{cert.user?.name || 'N/A'}</td>
                      <td>{cert.issueDate}</td>
                      <td>{cert.expiryDate}</td>
                      <td>{cert.addedAt ? new Date(cert.addedAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllCertificates;
