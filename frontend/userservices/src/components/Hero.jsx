import React from 'react';
import { Search, Wind, Zap, Droplets, Sparkles, ShieldCheck, Clock, Award } from './Icons';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  onOpenAuth,
  user
}) {
  const categories = [
    { id: 'ALL', label: 'All Services', icon: Sparkles },
    { id: 'AC Repair', label: 'AC Repair & HVAC', icon: Wind, featured: true },
    { id: 'Electrical', label: 'Electrical', icon: Zap },
    { id: 'Plumbing', label: 'Plumbing', icon: Droplets },
    { id: 'Cleaning', label: 'Deep Cleaning', icon: Sparkles },
  ];

  return (
    <section style={{
      position: 'relative',
      padding: '48px 24px 36px',
      textAlign: 'center',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, rgba(10, 14, 23, 0) 100%)'
    }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* Top Trust Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#a5b4fc',
          fontSize: '0.825rem',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          <ShieldCheck size={16} />
          Certified AC Technicians & Guaranteed Upfront Pricing
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
          lineHeight: 1.15,
          marginBottom: '16px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc 70%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.03em'
        }}>
          Expert AC Repair & Home Services On Demand
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 32px',
          lineHeight: 1.6
        }}>
          From high-pressure split AC jet cleaning to refrigerant gas recharge and PCB repairs — hire verified local pros or register your business in seconds.
        </p>

        {/* Search Bar */}
        <div style={{
          maxWidth: '580px',
          margin: '0 auto 28px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '18px', 
              color: 'var(--text-dim)',
              pointerEvents: 'none' 
            }} 
          />
          <input
            type="text"
            placeholder="Search 'AC Repair', 'Gas Refill', 'Jet Cleaning', 'Electrical'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 20px 16px 50px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 12px 30px -10px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--user-primary)';
              e.target.style.background = 'rgba(255, 255, 255, 0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '16px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '36px'
        }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: isSelected 
                    ? '1px solid #818cf8' 
                    : cat.featured 
                      ? '1px solid rgba(6, 182, 212, 0.4)' 
                      : '1px solid var(--border-subtle)',
                  background: isSelected 
                    ? 'var(--user-gradient)' 
                    : cat.featured 
                      ? 'rgba(6, 182, 212, 0.12)' 
                      : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#ffffff' : cat.featured ? '#38bdf8' : 'var(--text-muted)',
                  boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          maxWidth: '720px',
          margin: '0 auto',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <Award size={20} color="#fbbf24" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#ffffff' }}>4.9 / 5.0</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Avg Customer Rating</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <Clock size={20} color="#38bdf8" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#ffffff' }}>45 Mins</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Rapid Doorstep Service</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#34d399" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#ffffff' }}>90-Day Warranty</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>On All Spare Parts & Gas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
