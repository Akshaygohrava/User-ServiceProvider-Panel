import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, Lock, Phone, MapPin, Building, Sparkles, ArrowRight, CheckCircle } from './Icons';
import api from '../services/api';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialRole = 'USER', 
  initialMode = 'login', 
  onAuthSuccess, 
  showToast 
}) {
  const [role, setRole] = useState(initialRole); // 'USER' or 'SERVICE_PROVIDER'
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [loading, setLoading] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    specialization: 'AC Repair & HVAC',
    address: '',
    city: ''
  });

  useEffect(() => {
    setRole(initialRole);
    setMode(initialMode);
  }, [initialRole, initialMode, isOpen]);

  if (!isOpen) return null;

  const isProvider = role === 'SERVICE_PROVIDER';
  const isLogin = mode === 'login';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fillDemo = (demoType) => {
    if (demoType === 'user') {
      setRole('USER');
      setMode('login');
      setFormData(prev => ({
        ...prev,
        email: 'user@example.com',
        password: 'Qwerty@1234'
      }));
    } else {
      setRole('SERVICE_PROVIDER');
      setMode('login');
      setFormData(prev => ({
        ...prev,
        email: 'provider@example.com',
        password: 'Qwerty@1234'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (isProvider) {
        if (isLogin) {
          res = await api.loginProvider({ email: formData.email, password: formData.password });
        } else {
          res = await api.registerProvider({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            businessName: formData.businessName || `${formData.fullName} Services`,
            specialization: formData.specialization,
            address: formData.address,
            city: formData.city
          });
        }
      } else {
        if (isLogin) {
          res = await api.loginUser({ email: formData.email, password: formData.password });
        } else {
          res = await api.registerUser({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            city: formData.city
          });
        }
      }

      if (res && res.success) {
        showToast(res.message || 'Authentication successful!', 'success');
        onAuthSuccess(res.user, role);
        onClose();
      } else {
        showToast(res?.message || 'Authentication failed', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Network error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Top Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#111827',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <button
            type="button"
            onClick={() => setRole('USER')}
            style={{
              padding: '16px',
              border: 'none',
              background: !isProvider ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              borderBottom: !isProvider ? '3px solid var(--user-primary)' : '3px solid transparent',
              color: !isProvider ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <User size={18} color={!isProvider ? '#818cf8' : '#9ca3af'} />
            1. User / Customer
          </button>

          <button
            type="button"
            onClick={() => setRole('SERVICE_PROVIDER')}
            style={{
              padding: '16px',
              border: 'none',
              background: isProvider ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              borderBottom: isProvider ? '3px solid var(--provider-primary)' : '3px solid transparent',
              color: isProvider ? '#ffffff' : 'var(--text-muted)',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <Briefcase size={18} color={isProvider ? '#fbbf24' : '#9ca3af'} />
            2. Service Provider
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>
                {isProvider ? 'Service Provider Portal' : 'Customer Account'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isLogin 
                  ? (isProvider ? 'Login to manage your services and accept job requests' : 'Login to book and accept home services')
                  : (isProvider ? 'Register your AC repair / service business' : 'Create an account to book verified services')}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Mode Tabs: Login vs Register */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-input)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                background: isLogin ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isLogin ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              style={{
                flex: 1,
                padding: '8px',
                border: 'none',
                borderRadius: '6px',
                background: !isLogin ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: !isLogin ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Create Account
            </button>
          </div>

          {/* 1-Click Fast Demo Logins */}
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px dashed var(--border-subtle)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} color="#f59e0b" />
              <span>Instant Test:</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fillDemo('user')}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                👤 Demo User
              </button>
              <button
                type="button"
                onClick={() => fillDemo('provider')}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 10px', color: '#fbbf24' }}
              >
                🛠️ Demo AC Provider
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder={isProvider ? 'Rajesh Sharma' : 'Akshay Verma'}
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {isProvider && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Business / Agency Name</label>
                      <input
                        type="text"
                        name="businessName"
                        placeholder="Apex Cooling & AC Techs"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Primary Specialization</label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="AC Repair & HVAC">AC Repair & HVAC Systems</option>
                        <option value="Electrical Services">Electrical & MCB Diagnostics</option>
                        <option value="Plumbing">Plumbing & Water Piping</option>
                        <option value="Deep Cleaning">Deep Cleaning & Sanitization</option>
                        <option value="Home Appliances">Home Appliances</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Flat 402, Civil Lines"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="New Delhi"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder={isProvider ? 'provider@example.com' : 'user@example.com'}
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn btn-lg ${isProvider ? 'btn-primary-provider' : 'btn-primary-user'}`}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {loading ? 'Please wait...' : (
                <>
                  {isLogin 
                    ? `Sign In as ${isProvider ? 'Service Provider' : 'User'}` 
                    : `Complete ${isProvider ? 'Provider' : 'User'} Registration`}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
