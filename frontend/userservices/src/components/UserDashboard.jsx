import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Hourglass, 
  Wrench, 
  Phone, 
  ExternalLink,
  Sparkles,
  ShoppingBag
} from './Icons';
import ServiceCard from './ServiceCard';

export default function UserDashboard({ 
  services, 
  bookings, 
  activeTab, 
  setActiveTab, 
  onBookService, 
  user, 
  onOpenAuth,
  searchQuery,
  selectedCategory,
  onCancelBooking
}) {
  const isBookingsTab = activeTab === 'user-bookings';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="badge badge-accepted">Accepted by Provider</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-inprogress">Work In Progress</span>;
      case 'COMPLETED':
        return <span className="badge badge-completed">Completed</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="badge badge-rejected">{status}</span>;
      default:
        return <span className="badge badge-pending">Pending Provider Acceptance</span>;
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 1;
      case 'ACCEPTED': return 2;
      case 'IN_PROGRESS': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
      {/* Subnav Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('explore')}
            className={`btn ${!isBookingsTab ? 'btn-primary-user' : 'btn-secondary'}`}
            style={{ fontSize: '0.9rem', padding: '8px 18px' }}
          >
            <Sparkles size={16} />
            Available Services ({services.length})
          </button>

          <button
            onClick={() => {
              if (!user) {
                onOpenAuth('USER', 'login');
              } else {
                setActiveTab('user-bookings');
              }
            }}
            className={`btn ${isBookingsTab ? 'btn-primary-user' : 'btn-secondary'}`}
            style={{ fontSize: '0.9rem', padding: '8px 18px' }}
          >
            <ShoppingBag size={16} />
            My Bookings ({bookings.length})
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          {selectedCategory !== 'ALL' ? `Filtering by ${selectedCategory}` : 'Showing all verified categories'}
        </div>
      </div>

      {/* VIEW 1: Explore Services Marketplace */}
      {!isBookingsTab && (
        <>
          {services.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--text-muted)'
              }}>
                <Wrench size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#fff' }}>No Services Match Your Search</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
                Try adjusting your search query or select another category from the top filters.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBook={onBookService}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: User's Bookings */}
      {isBookingsTab && (
        <div>
          {!user ? (
            <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '12px' }}>Please Log In to View Your Bookings</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                Sign in with your customer account to track the status of your accepted and requested services.
              </p>
              <button onClick={() => onOpenAuth('USER', 'login')} className="btn btn-primary-user">
                User Sign In
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Hourglass size={36} color="#818cf8" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>No Bookings Yet</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 24px' }}>
                You have not booked any services yet. Check out our certified AC repair technicians and home pros!
              </p>
              <button onClick={() => setActiveTab('explore')} className="btn btn-primary-user">
                Browse AC & Home Services
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {bookings.map(booking => {
                const step = getStepIndex(booking.status);
                return (
                  <div key={booking.id} className="glass-card" style={{ padding: '24px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '16px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                            {booking.service?.title || 'Service Booking'}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Booking ID: #{booking.id} • Requested on {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Today'}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block' }}>Total Payable</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399' }}>
                          ₹{booking.totalAmount || booking.service?.price}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Live Status Stepper */}
                    {booking.status !== 'REJECTED' && booking.status !== 'CANCELLED' && (
                      <div style={{
                        padding: '18px 20px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '20px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          position: 'relative',
                          textAlign: 'center'
                        }}>
                          {/* Step 1 */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: step >= 1 ? '#6366f1' : 'rgba(255,255,255,0.1)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              zIndex: 2
                            }}>
                              1
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: step === 1 ? '700' : '500', color: step >= 1 ? '#ffffff' : 'var(--text-dim)' }}>
                              Requested
                            </span>
                          </div>

                          {/* Step 2 */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: step >= 2 ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              zIndex: 2
                            }}>
                              2
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: step === 2 ? '700' : '500', color: step >= 2 ? '#ffffff' : 'var(--text-dim)' }}>
                              Accepted
                            </span>
                          </div>

                          {/* Step 3 */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: step >= 3 ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              zIndex: 2
                            }}>
                              3
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: step === 3 ? '700' : '500', color: step >= 3 ? '#ffffff' : 'var(--text-dim)' }}>
                              In Progress
                            </span>
                          </div>

                          {/* Step 4 */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: step >= 4 ? '#10b981' : 'rgba(255,255,255,0.1)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              zIndex: 2
                            }}>
                              ✓
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: step === 4 ? '700' : '500', color: step >= 4 ? '#34d399' : 'var(--text-dim)' }}>
                              Completed
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Booking Details Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '14px',
                      fontSize: '0.85rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <Calendar size={16} color="#818cf8" />
                        <span>Date: <strong>{booking.bookingDate || 'Scheduled'}</strong></span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <Clock size={16} color="#818cf8" />
                        <span>Slot: <strong>{booking.timeSlot || 'Standard'}</strong></span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <Phone size={16} color="#818cf8" />
                        <span>Provider: <strong>{booking.provider?.businessName || booking.provider?.fullName}</strong></span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                        <MapPin size={16} color="#818cf8" />
                        <span>Address: <strong>{booking.customerAddress || 'Customer Address'}</strong></span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div style={{
                        marginTop: '14px',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(0,0,0,0.25)',
                        fontSize: '0.825rem',
                        color: 'var(--text-muted)'
                      }}>
                        <strong>Notes / Updates:</strong> {booking.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
