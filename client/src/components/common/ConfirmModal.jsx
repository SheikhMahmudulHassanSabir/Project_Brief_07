import React, { useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  onConfirm, 
  onClose, 
  type = 'danger' 
}) {
  
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = type === 'danger';
  const Icon = isDanger ? AlertTriangle : Info;
  const iconColor = isDanger ? 'var(--danger-text)' : 'var(--palette-accent)';
  const iconBg = isDanger ? 'var(--danger-bg)' : 'var(--primary-50)';
  const confirmBtnClass = isDanger ? 'btn btn-danger' : 'btn btn-primary';

  return (
    <div className="app-modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="app-modal-box" 
        style={{ 
          maxWidth: '450px', 
          padding: '2rem', 
          textAlign: 'center',
          animation: 'fadeUp 0.2s ease-out forwards'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: '1rem', 
            right: '1rem', 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer', 
            color: 'var(--text-muted)' 
          }}
        >
          <X size={20} />
        </button>

        <div 
          style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: iconBg, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            border: `1px solid ${isDanger ? 'var(--danger-border)' : 'var(--palette-accent)'}`
          }}
        >
          <Icon size={32} color={iconColor} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.75rem 0', color: 'var(--text-primary)' }}>
          {title}
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem', fontSize: '0.95rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn btn-secondary" 
            style={{ flex: 1, padding: '0.75rem' }} 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={confirmBtnClass} 
            style={{ flex: 1, padding: '0.75rem' }} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default ConfirmModal;
