import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-premium">
      <div className="footer-shell">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <h3>🎓 Certification Tracker</h3>
            <p>
            Your trusted platform for managing professional certifications.
            </p>
            <div className="footer-badges">
              <span>Secure Archive</span>
              <span>Auto Reminders</span>
              <span>Role Access</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <a href="#">Features</a>
              <a href="#">About Us</a>
              <a href="#">Contact</a>
            </div>
          </div>

          <div className="footer-contact-col">
            <div>📧 certtracker@gmail.com</div>
            <div>📞 +91 98765 43210</div>
            <div>📍 Hyderabad, India</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Certification Tracker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
