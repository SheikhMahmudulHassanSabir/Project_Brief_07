import React from 'react';

function Welcome({ userName, dashboardTitle, organizationName, subtitle }) {
  return (
    <div>
      <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
        {dashboardTitle || 'Dashboard'}
      </h1>
      <p style={{ color: 'var(--text-secondary)' }}>
        Welcome back, <strong>{userName || 'Guest'}</strong> 
        {organizationName && (
          <>
            {' '}• <span style={{ color: 'var(--palette-accent)', fontWeight: '600' }}>{organizationName}</span>
          </>
        )}
        {subtitle && (
          <>
            {' '}• {subtitle}
          </>
        )}
      </p>
    </div>
  );
}

export default Welcome;
