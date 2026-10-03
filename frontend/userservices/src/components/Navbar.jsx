import React from 'react';
import { 
  Wrench, 
  Wind, 
  User as UserIcon, 
  Briefcase, 
  LogOut, 
  PlusCircle, 
  CalendarCheck, 
  Layers, 
  ShieldCheck,
  Sparkles
} from './Icons';

export default function Navbar({ 
  user, 
  activeRole, 
  setActiveRole, 
  activeTab, 
  setActiveTab, 
  onOpenAuth, 
  onLogout,
  onOpenAddService,
  pendingBookingsCount = 0,
  userBookingsCount = 0
}) {
  const isProvider = activeRole === 'SERVICE_PROVIDER';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('explore')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer' 
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: isProvider ? 'var(--provider-gradient)' : 'var(--user-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isProvider ? '#111827' : '#ffffff',
            boxShadow: isProvider ? 'var(--shadow-glow-provider)' : 'var(--shadow-glow-user)',
            transition: 'all 0.3s ease'
          }}>
            {isProvider ? <Wrench size={22} /> : <Wind size={22} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                fontWeight: '800', 
                letterSpacing: '-0.02em',
                color: '#ffffff'
              }}>
                ServiZen
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '6px',
                background: isProvider ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                color: isProvider ? '#fbbf24' : '#818cf8',
                border: isProvider ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)'
              }}>
                {isProvider ? 'PRO PROVIDER' : 'CLIENT HUB'}
              </span>
            </div>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '-2px' }}>
              AC & Home Services Network
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isProvider ? (
            <>
              <button 
                onClick={() => setActiveTab('provider-services')}
                className={`btn btn-sm ${activeTab === 'provider-services' ? 'btn-secondary' : ''}`}
                style={{
                  background: activeTab === 'provider-services' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activeTab === 'provider-services' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                <Layers size={16} />
                My Services
              </button>

              <button 
                onClick={() => setActiveTab('provider-bookings')}
                className={`btn btn-sm ${activeTab === 'provider-bookings' ? 'btn-secondary' : ''}`}
                style={{
                  background: activeTab === 'provider-bookings' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activeTab === 'provider-bookings' ? '#ffffff' : 'var(--text-muted)',
                  position: 'relative'
                }}
              >
                <CalendarCheck size={16} />
                Customer Requests
                {pendingBookingsCount > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    marginLeft: '4px',
                    fontWeight: 'bold'
                  }}>
                    {pendingBookingsCount}
                  </span>
                )}
              </button>

              <button 
                onClick={onOpenAddService}
                className="btn btn-sm btn-primary-provider"
              >
                <PlusCircle size={16} />
                + Add Service
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setActiveTab('explore')}
                className={`btn btn-sm ${activeTab === 'explore' ? 'btn-secondary' : ''}`}
                style={{
                  background: activeTab === 'explore' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activeTab === 'explore' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                <Sparkles size={16} />
                Explore Services
              </button>

              <button 
                onClick={() => setActiveTab('user-bookings')}
                className={`btn btn-sm ${activeTab === 'user-bookings' ? 'btn-secondary' : ''}`}
                style={{
                  background: activeTab === 'user-bookings' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activeTab === 'user-bookings' ? '#ffffff' : 'var(--text-muted)',
                  position: 'relative'
                }}
              >
                <CalendarCheck size={16} />
                My Bookings
                {userBookingsCount > 0 && (
                  <span style={{
                    background: '#6366f1',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    marginLeft: '4px',
                    fontWeight: 'bold'
                  }}>
                    {userBookingsCount}
                  </span>
                )}
              </button>
            </>
          )}
        </nav>

        {/* Role Switcher & Auth Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Portal Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.06)',
            padding: '3px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => {
                setActiveRole('USER');
                setActiveTab('explore');
              }}
              style={{
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: !isProvider ? 'var(--user-gradient)' : 'transparent',
                color: !isProvider ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              <UserIcon size={14} />
              User
            </button>
            <button
              onClick={() => {
                setActiveRole('SERVICE_PROVIDER');
                setActiveTab('provider-services');
              }}
              style={{
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isProvider ? 'var(--provider-gradient)' : 'transparent',
                color: isProvider ? '#111827' : 'var(--text-muted)'
              }}
            >
              <Briefcase size={14} />
              Provider
            </button>
          </div>

          {/* User Account / Login State */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isProvider ? '#f59e0b' : '#6366f1',
                  color: isProvider ? '#111827' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.8rem'
                }}>
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#ffffff' }}>
                    {user.businessName || user.fullName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {user.role === 'SERVICE_PROVIDER' ? 'Provider' : 'Customer'}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log Out"
                className="btn btn-sm btn-secondary"
                style={{ padding: '8px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => onOpenAuth('USER', 'login')}
                className="btn btn-sm btn-outline-user"
              >
                User Login
              </button>
              <button
                onClick={() => onOpenAuth('SERVICE_PROVIDER', 'login')}
                className="btn btn-sm btn-primary-provider"
              >
                Provider Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
