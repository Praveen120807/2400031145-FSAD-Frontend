import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavBar from './UserNavBar';
import { getCertificatesByUser } from '../api/certificate';
import { useAuth } from '../context/AuthContext';
import './UserTheme.css';

const UserHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [activeCertificates, setActiveCertificates] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const data = await getCertificatesByUser(user.id);
      setTotalCertificates(data.length);

      // Calculate expiring soon (within 30 days)
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const expiring = data.filter(cert => {
        const expiryDate = new Date(cert.expiryDate);
        return expiryDate >= today && expiryDate <= thirtyDaysFromNow;
      });
      setExpiringSoon(expiring.length);

      // Calculate active certificates (not expired)
      const active = data.filter(cert => {
        const expiryDate = new Date(cert.expiryDate);
        return expiryDate >= today;
      });
      setActiveCertificates(active.length);

    } catch (error) {
      if (error.response?.status !== 204) {
        console.error('Error fetching certificates:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const portfolioHealth = totalCertificates === 0
    ? 0
    : Math.round((activeCertificates / totalCertificates) * 100);

  const renewalNeedsAction = expiringSoon > 0;

  return (
    <div className="user-page">
      <UserNavBar />
      <div className="user-shell">
        <section className="user-dashboard-hero user-card">
          <div>
            <h1 className="user-title">My Dashboard</h1>
            <p className="user-subtitle">Overview of your certification portfolio and renewal health.</p>
          </div>
          <div className="user-dashboard-actions">
            <button onClick={() => navigate('/user/add-certificate')} className="user-btn user-btn-primary">Add Certificate</button>
            <button onClick={() => navigate('/user/view-certificates')} className="user-btn user-btn-secondary">View Portfolio</button>
          </div>
        </section>

        <div className="user-grid user-kpi-grid">
          <div className="user-card user-stat-card user-kpi-card kpi-total">
            <h3 className="user-stat-title">Total Certificates</h3>
            <p className="user-stat-value">
              {loading ? '...' : totalCertificates}
            </p>
          </div>
          <div className="user-card user-stat-card user-kpi-card kpi-expiring">
            <h3 className="user-stat-title">Expiring Soon</h3>
            <p className="user-stat-value">
              {loading ? '...' : expiringSoon}
            </p>
            <p className="user-stat-note">Within 30 days</p>
          </div>
          <div className="user-card user-stat-card user-kpi-card kpi-active">
            <h3 className="user-stat-title">Active</h3>
            <p className="user-stat-value">
              {loading ? '...' : activeCertificates}
            </p>
          </div>
        </div>

        <div className="user-grid user-insight-grid">
          <div className="user-card user-insight-card insight-health">
            <h3 className="user-stat-title">Portfolio Health</h3>
            <p className="user-insight-value">{loading ? '...' : `${portfolioHealth}%`}</p>
            <p className="user-stat-note">Active certificates as a percentage of your total portfolio.</p>
          </div>

          <div className={`user-card user-insight-card ${renewalNeedsAction ? 'insight-attention' : 'insight-good'}`}>
            <h3 className="user-stat-title">Renewal Attention</h3>
            <p className="user-insight-value">
              {loading ? '...' : renewalNeedsAction ? 'Action Required' : 'On Track'}
            </p>
            <p className="user-stat-note">
              {loading
                ? 'Checking renewal timeline...'
                : renewalNeedsAction
                  ? `${expiringSoon} certificate(s) need attention soon.`
                  : 'No upcoming renewals in the next 30 days.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
