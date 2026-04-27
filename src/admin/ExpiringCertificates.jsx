import { useState } from 'react';
import AdminNavBar from './AdminNavBar';
import { getAllCertificates, sendEmail } from '../api/admin';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import './AdminTheme.css';

const ExpiringCertificates = () => {
  const [date, setDate] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [modal, setModal] = useState(null); // cert object or null
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '' });

  const normalizeDate = (value) => {
    if (!value) return null;
    const dateValue = new Date(value);
    if (Number.isNaN(dateValue.getTime())) return null;
    return new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
  };

  const filterExpiringCertificates = (allCertificates, selectedDate) => {
    const cutoffDate = normalizeDate(selectedDate);
    if (!cutoffDate) return [];

    return (allCertificates || []).filter((cert) => {
      const expiryDate = normalizeDate(cert.expiryDate);
      return expiryDate && expiryDate <= cutoffDate;
    });
  };

  const fetchExpiring = async () => {
    if (!date) return toast.warn('Please select a date');
    setLoading(true);
    try {
      const allCertificates = await getAllCertificates();
      const expiringCertificates = filterExpiringCertificates(allCertificates, date);
      setCertificates(expiringCertificates);
      setFetched(true);
    } catch (error) {
      if (error.response?.status === 204) {
        setCertificates([]);
        setFetched(true);
      } else {
        toast.error('Error fetching expiring certificates');
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cert) => {
    setForm({
      subject: `Certificate Expiry Notice: ${cert.certName}`,
      message: `Dear ${cert.user?.name || 'User'},\n\nYour certificate "${cert.certName}" issued by ${cert.orgName} is expiring on ${cert.expiryDate}. Please renew it at the earliest.\n\nRegards,\nAdmin`,
    });
    setModal(cert);
  };

  const handleSend = async () => {
    if (!form.subject.trim() || !form.message.trim()) return toast.warn('Subject and message are required');
    setSending(true);
    try {
      await sendEmail({
        fullname: modal.user?.name || '',
        receiveremail: modal.user?.email || '',
        contact: modal.user?.Contact || '',
        subject: form.subject,
        message: form.message,
      });
      toast.success('Email sent successfully');
      setModal(null);
    } catch {
      toast.error('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminNavBar />
      <div className="admin-shell">
        <h1 className="admin-title">Expiring Certificates</h1>
        <p className="admin-section-note">
          Find certificates expiring before a selected date and notify users via email.
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="admin-search"
            style={{ maxWidth: '220px' }}
          />
          <button className="admin-hero-action admin-hero-action-primary" onClick={fetchExpiring}>
            Search
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : fetched && (
          <div className="admin-table-wrap">
            <div className="admin-table-meta">
              <span className="admin-table-chip">{certificates.length} expiring</span>
              <span className="admin-table-chip admin-table-chip-soft">On or before {date}</span>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Certificate</th>
                  <th>Organization</th>
                  <th>User</th>
                  <th>Expiry Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {certificates.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-empty">No expiring certificates found</td>
                  </tr>
                ) : (
                  certificates.map((cert) => (
                    <tr key={cert.id}>
                      <td>{cert.certName}</td>
                      <td>{cert.orgName}</td>
                      <td>{cert.user?.name || 'N/A'}</td>
                      <td style={{ color: '#f4a261', fontWeight: 600 }}>{cert.expiryDate}</td>
                      <td>
                        <button className="admin-hero-action" style={{ padding: '7px 14px', fontSize: '0.82rem' }} onClick={() => openModal(cert)}>
                          ✉ Send Email
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div style={overlay}>
          <div style={modalBox}>
            <h3 style={{ margin: '0 0 14px', color: '#eff6ff', fontSize: '1.05rem' }}>Send Email Notification</h3>
            <p style={{ margin: '0 0 14px', color: '#8ea0bc', fontSize: '0.85rem' }}>
              To: <strong style={{ color: '#cfe4ff' }}>{modal.user?.email || 'N/A'}</strong>
            </p>
            <input
              className="admin-search"
              style={{ maxWidth: '100%', marginBottom: '10px', display: 'block' }}
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
            />
            <textarea
              className="admin-search"
              style={{ maxWidth: '100%', width: '100%', minHeight: '120px', resize: 'vertical', display: 'block', marginBottom: '14px', fontFamily: 'inherit' }}
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="admin-btn-danger" onClick={() => setModal(null)} disabled={sending}>Cancel</button>
              <button className="admin-hero-action admin-hero-action-primary" onClick={handleSend} disabled={sending}>
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const overlay = {
  position: 'fixed', inset: 0, background: 'rgba(4,8,18,0.72)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
};

const modalBox = {
  background: 'linear-gradient(145deg, #101a2a, #0a1020)',
  border: '1px solid rgba(160,187,255,0.18)',
  borderRadius: '16px', padding: '28px', width: 'min(520px, 92vw)',
  boxShadow: '0 24px 56px rgba(2,6,16,0.6)',
};

export default ExpiringCertificates;
