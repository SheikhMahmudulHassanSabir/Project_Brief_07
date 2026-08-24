import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoW from '../../assets/images/logo_W.png';
import logoB from '../../assets/images/logo_B.png';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [currentTheme, setCurrentTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || localStorage.getItem('app-theme') || 'light';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      setCurrentTheme(theme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const activeLogo = currentTheme === 'dark' ? logoB : logoW;

  return (
    <footer
      style={{
        background: 'var(--footer-bg)',
        color: 'var(--footer-text)',
        borderTop: '1px solid var(--footer-border)',
        marginTop: 'auto',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      <div className="container" style={{ padding: '3.5rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Col 1: Brand */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', padding: 0, margin: 0 }}>
              <img
                src={activeLogo}
                alt="Job Connect Portal"
                style={{
                  height: '46px',
                  width: 'auto',
                  maxWidth: '180px',
                  objectFit: 'contain',
                  display: 'block',
                  marginBottom: '0.85rem',
                }}
              />
            </Link>
            <p style={{ fontSize: '0.9rem', color: 'var(--footer-text)', lineHeight: '1.6', maxWidth: '280px' }}>
              The centralized recruitment platform connecting ambitious talent with world-class employers. Fast, verified, and organized.
            </p>
          </div>

          {/* Col 2: Job Seekers */}
          <div>
            <h4 style={{ color: 'var(--footer-heading)', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>For Job Seekers</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/jobs" style={{ color: 'var(--footer-link)' }}>Browse Jobs</Link></li>
              <li><Link to="/jobseeker" style={{ color: 'var(--footer-link)' }}>Candidate Portal</Link></li>
              <li><Link to="/register" style={{ color: 'var(--footer-link)' }}>Create Profile</Link></li>
              <li><Link to="/jobs?category=Engineering" style={{ color: 'var(--footer-link)' }}>Tech Opportunities</Link></li>
            </ul>
          </div>

          {/* Col 3: Employers */}
          <div>
            <h4 style={{ color: 'var(--footer-heading)', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>For Employers</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/employer" style={{ color: 'var(--footer-link)' }}>Employer Portal</Link></li>
              <li><Link to="/post-job" style={{ color: 'var(--footer-link)' }}>Post a Vacancy</Link></li>
              <li><Link to="/employer" style={{ color: 'var(--footer-link)' }}>Review Applicants</Link></li>
              <li><Link to="/register" style={{ color: 'var(--footer-link)' }}>Hire Talent</Link></li>
            </ul>
          </div>

          {/* Col 4: Company & Support */}
          <div>
            <h4 style={{ color: 'var(--footer-heading)', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem' }}>Company & Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/about" style={{ color: 'var(--footer-link)' }}>About Us</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--footer-link)' }}>Contact & Support</Link></li>
              <li><Link to="/admin" style={{ color: 'var(--footer-link)' }}>Admin Overview</Link></li>
              <li><Link to="/login" style={{ color: 'var(--footer-link)' }}>Account Sign In</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div style={{ borderTop: '1px solid var(--footer-border)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            © {currentYear} Job Connect Portal. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Built with MERN Stack</span>
            <span>•</span>
            <span>Fast & Reliable Hiring</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
