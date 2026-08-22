import React from 'react';
import { Link } from 'react-router-dom';

function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        background: 'radial-gradient(ellipse at top, var(--bg-surface-subtle) 0%, var(--bg-app) 100%)',
      }}
    >
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: '1.1rem',
              boxShadow: 'var(--primary-shadow)',
            }}
          >
            JP
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            JobPortal
          </span>
        </Link>
      </div>

      <div style={{ width: '100%', maxWidth: '540px' }}>
        {children}
      </div>

      <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} Job Portal System. Secure Enterprise Authentication.
      </div>
    </div>
  );
}

export default AuthLayout;
