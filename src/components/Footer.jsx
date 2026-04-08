import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-premium">
      <div className="footer-shell">
        <div className="footer-topline">
          <span>Built for professionals and enterprise teams</span>
          <span className="footer-topline-divider" aria-hidden="true" />
          <span>Reliable certification lifecycle management</span>
        </div>

        <div className="footer-grid">
          <div className="footer-brand-col">
            <h3 className="footer-brand-title">
              <span className="footer-brand-mark" aria-hidden="true">CT</span>
              Certification Tracker
            </h3>
            <p>
              Your trusted platform for managing professional certifications and
              compliance journeys.
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
            <h4>Contact</h4>
            <div className="footer-contact-row">
              <span className="footer-contact-label">Email</span>
              <span>certtracker@gmail.com</span>
            </div>
            <div className="footer-contact-row">
              <span className="footer-contact-label">Phone</span>
              <span>+91 98765 43210</span>
            </div>
            <div className="footer-contact-row">
              <span className="footer-contact-label">Location</span>
              <span>Hyderabad, India</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Certification Tracker. All rights reserved.</span>
        <div className="footer-legal-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
