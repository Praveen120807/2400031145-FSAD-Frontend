import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import Footer from '../components/Footer';
import './Home.css';
import certCloud from '../assets/certificate-cloud.svg';
import certCyber from '../assets/certificate-cyber.svg';
import certData from '../assets/certificate-data.svg';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const handleCertificateMouseMove = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const rotateY = ((offsetX / rect.width) - 0.5) * 6;
    const rotateX = ((offsetY / rect.height) - 0.5) * -6;

    card.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`);
    card.style.setProperty('--card-lift', '-5px');
  };

  const handleCertificateMouseLeave = (event) => {
    const card = event.currentTarget;
    card.style.setProperty('--card-rotate-x', '0deg');
    card.style.setProperty('--card-rotate-y', '0deg');
    card.style.setProperty('--card-lift', '0px');
  };

  return (
    <div className="home-page">
      <MainNavBar />

      {/* Hero Section */}
      <section className="home-hero" data-reveal>
        <div className="home-ambient home-ambient-left" aria-hidden="true" />
        <div className="home-ambient home-ambient-right" aria-hidden="true" />
        <div className="home-container home-hero-content">
          <div className="home-trust-badge">Trusted by 10,000+ Professionals</div>
          <h1>Track and Manage Your Professional Certifications</h1>
          <p>
            Stay organized and never miss a certification renewal. Keep your career
            credentials up-to-date with our intelligent tracking platform.
          </p>
          <div className="home-hero-actions">
            <button onClick={() => navigate('/register')} className="home-btn home-btn-primary">
              Get Started Free
            </button>
          </div>
          <div className="home-hero-checks">
            <span>No credit card required</span>
            <span>Free forever plan</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="home-stats-wrap" data-reveal>
        <div className="home-container home-stats-grid">
          <div className="home-stat-card">
            <div className="home-stat-value">10K+</div>
            <div className="home-stat-label">Active Users</div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-value">50K+</div>
            <div className="home-stat-label">Certifications Tracked</div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-value">99.9%</div>
            <div className="home-stat-label">Uptime</div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-value">24/7</div>
            <div className="home-stat-label">Support</div>
          </div>
        </div>
      </section>

      <section className="home-trust-rail" data-reveal>
        <div className="home-container home-trust-grid">
          <div className="home-trust-card">Enterprise-ready certificate governance</div>
          <div className="home-trust-card">Automated expiry intelligence and reminders</div>
          <div className="home-trust-card">Secure document vault with role-based access</div>
        </div>
      </section>

      {/* Certificate Preview Section */}
      <section className="home-gallery" data-reveal>
        <div className="home-container">
          <h2>Certificate Portfolio Preview</h2>
          <p className="home-section-subtitle">
            Keep every credential in one beautiful dashboard with status, expiry, and
            quick renewal actions.
          </p>

          <div className="home-gallery-grid">
            <article
              className="home-gallery-card"
              onMouseMove={handleCertificateMouseMove}
              onMouseLeave={handleCertificateMouseLeave}
            >
              <img src={certCloud} alt="Cloud Architect certificate preview" loading="lazy" />
              <div className="home-gallery-content">
                <h3>AWS Solutions Architect</h3>
                <p>Issued by Amazon Web Services</p>
                <span className="home-gallery-tag">Valid till Dec 2027</span>
              </div>
            </article>

            <article
              className="home-gallery-card"
              onMouseMove={handleCertificateMouseMove}
              onMouseLeave={handleCertificateMouseLeave}
            >
              <img src={certCyber} alt="Cybersecurity Analyst certificate preview" loading="lazy" />
              <div className="home-gallery-content">
                <h3>Cybersecurity Analyst</h3>
                <p>Issued by EC-Council Academy</p>
                <span className="home-gallery-tag home-gallery-tag-warning">Renew in 38 days</span>
              </div>
            </article>

            <article
              className="home-gallery-card"
              onMouseMove={handleCertificateMouseMove}
              onMouseLeave={handleCertificateMouseLeave}
            >
              <img src={certData} alt="Data Engineering Professional certificate preview" loading="lazy" />
              <div className="home-gallery-content">
                <h3>Data Engineering Professional</h3>
                <p>Issued by Google Cloud Skills</p>
                <span className="home-gallery-tag">Valid till Jul 2028</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features" data-reveal>
        <div className="home-container">
          <h2>Why Choose Our Platform?</h2>
          <p className="home-section-subtitle">
            Everything you need to manage your professional certifications
          </p>
          <div className="home-feature-grid">
            <div className="home-feature-card">
              <div className="home-feature-icon">📋</div>
              <h3>Track Certification Details</h3>
              <p>
                Keep all your professional certifications organized in one secure place
                with detailed information.
              </p>
            </div>
            <div className="home-feature-card">
              <div className="home-feature-icon">⏰</div>
              <h3>Monitor Expiry Dates</h3>
              <p>
                Never miss a renewal deadline with our intelligent expiry date tracking
                system.
              </p>
            </div>
            <div className="home-feature-card">
              <div className="home-feature-icon">🔔</div>
              <h3>Get Renewal Reminders</h3>
              <p>
                Receive timely notifications before your certifications expire to stay
                ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
