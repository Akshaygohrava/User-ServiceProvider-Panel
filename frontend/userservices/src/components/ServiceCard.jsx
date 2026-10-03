import React from 'react';
import { Clock, Star, MapPin, CheckCircle, ShieldCheck, Trash2, Edit3, ArrowRight } from './Icons';

export default function ServiceCard({ 
  service, 
  onBook, 
  isOwner = false, 
  onEdit, 
  onDelete 
}) {
  const isAcRepair = service.category === 'AC Repair' || service.title?.toLowerCase().includes('ac');

  return (
    <div className="glass-card glass-card-hover" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
      position: 'relative'
    }}>
      {/* Service Image */}
      <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
        <img
          src={service.imageUrl || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'}
          alt={service.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px'
        }}>
          <span className="badge badge-category" style={{
            background: isAcRepair ? 'rgba(6, 182, 212, 0.85)' : 'rgba(99, 102, 241, 0.85)',
            color: '#ffffff',
            border: 'none',
            backdropFilter: 'blur(4px)'
          }}>
            {service.category}
          </span>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Clock size={12} color="#38bdf8" />
          {service.duration || '60 Mins'}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px', lineHeight: 1.3 }}>
          {service.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          marginBottom: '16px',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {service.description}
        </p>

        {/* Provider Details Pill */}
        {service.provider && (
          <div style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#ffffff' }}>
                {service.provider.businessName || service.provider.fullName}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={11} />
                {service.provider.city || 'Verified Provider'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: '700' }}>
              <Star size={13} fill="#fbbf24" />
              <span>{service.provider.rating || 4.9}</span>
            </div>
          </div>
        )}

        {/* Bottom Bar: Price & CTA */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '14px',
          marginTop: 'auto'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>
              Fixed Price
            </span>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#38bdf8' }}>
              ₹{service.price}
            </span>
          </div>

          {isOwner ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onEdit(service)}
                className="btn btn-sm btn-secondary"
                title="Edit Service"
              >
                <Edit3 size={15} />
              </button>
              <button
                onClick={() => onDelete(service.id)}
                className="btn btn-sm btn-danger"
                title="Delete Service"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onBook(service)}
              className="btn btn-sm btn-primary-user"
              style={{ padding: '8px 16px' }}
            >
              Book Service
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
