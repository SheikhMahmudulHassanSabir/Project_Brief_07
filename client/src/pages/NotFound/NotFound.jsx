import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

function NotFound() {
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem' }}>
      <div className="card" style={{ maxWidth: '500px', padding: '3.5rem 2rem', border: '1.5px solid var(--border-default)' }}>
        <div style={{ fontSize: '4.5rem', fontWeight: '900', color: 'var(--palette-accent)', marginBottom: '0.5rem', lineHeight: 1 }}>
          404
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} />
            <span>Back to Homepage</span>
          </Link>
          <Link to="/jobs" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Search size={16} />
            <span>Browse Jobs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;