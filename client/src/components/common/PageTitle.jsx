import React from 'react';

function PageTitle({ title, description, actions }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h2 style={{ marginBottom: '0.35rem' }}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageTitle;
