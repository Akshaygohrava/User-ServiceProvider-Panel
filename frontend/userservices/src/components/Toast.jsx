import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from './Icons';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 20px',
      borderRadius: 'var(--radius-md)',
      background: isSuccess ? 'rgba(16, 185, 129, 0.95)' : isError ? 'rgba(239, 68, 68, 0.95)' : 'rgba(59, 130, 246, 0.95)',
      color: '#ffffff',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.4)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.2)',
      animation: 'scaleUp 0.25s ease-out',
      maxWidth: '420px',
      fontSize: '0.925rem',
      fontWeight: '500'
    }}>
      {isSuccess && <CheckCircle2 size={20} />}
      {isError && <AlertCircle size={20} />}
      {!isSuccess && !isError && <Info size={20} />}
      
      <span style={{ flex: 1 }}>{toast.message}</span>
      
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          opacity: 0.8
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
      >
        <X size={16} />
      </button>
    </div>
  );
}
