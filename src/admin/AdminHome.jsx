import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import { getAllUsers, getAllCertificates } from '../api/admin';
import './AdminTheme.css';

const AdminHome = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const users = await getAllUsers();
      setTotalUsers(users.length);
    } catch (error) {
      console.error('Error fetching users:', error);
    }

    try {
      const certificates = await getAllCertificates();
      setTotalCertificates(certificates.length);
    } catch (error) {
      if (error.response?.status !== 204) {
        console.error('Error fetching certificates:', error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="admin-page">
      <AdminNavBar />
      <div className="admin-shell">
        <section className="admin-hero admin-card">
          <div>
            <span className="admin-hero-badge">Operations overview</span>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-hero-text">
              Track platform activity, review records, and keep the certificate system organized from one control center.
            </p>
          </div>
          <div className="admin-hero-actions">
            <Link to="/admin/users" className="admin-hero-action admin-hero-action-primary">Review Users</Link>
            <Link to="/admin/certificates" className="admin-hero-action">Review Certificates</Link>
          </div>
        </section>

        <div className="admin-grid admin-grid-metrics">
          <div className="admin-card admin-card-users">
            <h3 className="admin-metric-title">Total Users</h3>
            <p className="admin-metric-value">{loading ? '...' : totalUsers}</p>
            <p className="admin-metric-note">Registered accounts in the platform</p>
          </div>
          <div className="admin-card admin-card-certificates">
            <h3 className="admin-metric-title">Total Certificates</h3>
            <p className="admin-metric-value">{loading ? '...' : totalCertificates}</p>
            <p className="admin-metric-note">Uploaded and tracked credentials</p>
          </div>
          <div className="admin-card admin-card-status">
            <h3 className="admin-metric-title">System Status</h3>
            <p className="admin-metric-value admin-metric-ok">Active</p>
            <p className="admin-metric-note">Admin tools are available now</p>
          </div>
        </div>

        <div className="admin-grid admin-grid-split">
          <section className="admin-card admin-panel admin-panel-primary">
            <h3 className="admin-panel-title">Quick actions</h3>
            <div className="admin-action-list">
              <Link to="/admin/users" className="admin-action-item">
                <strong>Users</strong>
                <span>Search, review, and manage accounts</span>
              </Link>
              <Link to="/admin/certificates" className="admin-action-item">
                <strong>Certificates</strong>
                <span>Inspect records and keep data clean</span>
              </Link>
            </div>
          </section>

          <section className="admin-card admin-panel admin-panel-secondary">
            <h3 className="admin-panel-title">Platform notes</h3>
            <ul className="admin-panel-list">
              <li>Use the search pages to locate entries quickly.</li>
              <li>Delete actions remain protected by existing confirmation logic.</li>
              <li>Keep certificates and user records aligned for a cleaner workflow.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
