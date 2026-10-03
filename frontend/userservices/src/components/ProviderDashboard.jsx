import React from 'react';
import { 
  Wrench, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle, 
  Play, 
  XCircle, 
  PlusCircle, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  Sparkles,
  Phone,
  FileText
} from './Icons';
import ServiceCard from './ServiceCard';

export default function ProviderDashboard({ 
  user, 
  providerServices, 
  providerBookings, 
  activeTab, 
  setActiveTab, 
  onOpenAddService, 
  onEditService, 
  onDeleteService,
  onUpdateBookingStatus,
  onOpenAuth
}) {
  if (!user || user.role !== 'SERVICE_PROVIDER') {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '50px 30px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#fbbf24'
          }}>
            <Wrench size={32} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '12px' }}>
            Service Provider Studio Access Required
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', maxWidth: '520px', margin: '0 auto 28px' }}>
            Please log in with your Service Provider account to add and manage AC repair services and accept customer bookings.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => onOpenAuth('SERVICE_PROVIDER', 'login')}
              className="btn btn-primary-provider"
            >
              Sign In as Service Provider
            </button>
            <button
              onClick={() => onOpenAuth('SERVICE_PROVIDER', 'register')}
              className="btn btn-secondary"
            >
              Register New Business
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const pendingCount = providerBookings.filter(b => b.status === 'PENDING').length;
  const acceptedCount = providerBookings.filter(b => b.status === 'ACCEPTED').length;
  const inProgressCount = providerBookings.filter(b => b.status === 'IN_PROGRESS').length;
  const completedCount = providerBookings.filter(b => b.status === 'COMPLETED').length;
  const totalEarnings = providerBookings
    .filter(b => b.status === 'COMPLETED' || b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS')
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const isBookingsView = activeTab === 'provider-bookings';

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
      {/* Provider Business Header */}
      <div className="glass-card" style={{
        padding: '28px 32px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(17, 24, 39, 0.8) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '1.75rem', color: '#ffffff' }}>
              {user.businessName || user.fullName}
            </h1>
            <span className="badge badge-pending">
              {user.specialization || 'AC Specialist'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Provider ID: #{user.id} • {user.city || 'Delhi NCR'} • ★ {user.rating || 4.9} ({user.reviewCount || 24} Verified Reviews)
          </p>
        </div>

        <button
          onClick={onOpenAddService}
          className="btn btn-lg btn-primary-provider"
        >
          <PlusCircle size={18} />
          Add New Service
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Published Services</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>{providerServices.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>Active in marketplace</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Pending Requests</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: pendingCount > 0 ? '#fbbf24' : '#ffffff' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Awaiting your acceptance</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Active Jobs</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#60a5fa' }}>
            {acceptedCount + inProgressCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginTop: '4px' }}>Accepted & In Progress</div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Total Service Value</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#34d399' }}>
            ₹{totalEarnings}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>From customer bookings</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '16px',
        marginBottom: '28px'
      }}>
        <button
          onClick={() => setActiveTab('provider-services')}
          className={`btn ${!isBookingsView ? 'btn-primary-provider' : 'btn-secondary'}`}
        >
          <Layers size={16} />
          My Services Catalog ({providerServices.length})
        </button>

        <button
          onClick={() => setActiveTab('provider-bookings')}
          className={`btn ${isBookingsView ? 'btn-primary-provider' : 'btn-secondary'}`}
          style={{ position: 'relative' }}
        >
          <Calendar size={16} />
          Incoming Customer Requests ({providerBookings.length})
          {pendingCount > 0 && (
            <span style={{
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '0.7rem',
              padding: '1px 6px',
              borderRadius: '10px',
              marginLeft: '6px',
              fontWeight: 'bold'
            }}>
              {pendingCount} New
            </span>
          )}
        </button>
      </div>

      {/* SECTION 1: My Published Services */}
      {!isBookingsView && (
        <div>
          {providerServices.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Wrench size={36} color="#fbbf24" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>No Services Added Yet</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 24px' }}>
                Add your AC repair packages, gas refills, maintenance services, or electrical jobs for users to discover and book.
              </p>
              <button onClick={onOpenAddService} className="btn btn-primary-provider">
                <PlusCircle size={16} />
                Add Your First Service
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {providerServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isOwner={true}
                  onEdit={onEditService}
                  onDelete={onDeleteService}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Customer Booking Requests */}
      {isBookingsView && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {providerBookings.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Clock size={36} color="#fbbf24" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>No Customer Requests Yet</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 24px' }}>
                When customers accept and book your services, their job orders will appear here for you to accept or manage.
              </p>
            </div>
          ) : (
            providerBookings.map(booking => {
              const isPending = booking.status === 'PENDING';
              const isAccepted = booking.status === 'ACCEPTED';
              const isInProgress = booking.status === 'IN_PROGRESS';
              const isCompleted = booking.status === 'COMPLETED';

              return (
                <div key={booking.id} className="glass-card" style={{ padding: '24px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                          {booking.service?.title || 'Service Request'}
                        </h3>
                        {booking.status === 'PENDING' && <span className="badge badge-pending">New Request</span>}
                        {booking.status === 'ACCEPTED' && <span className="badge badge-accepted">Accepted</span>}
                        {booking.status === 'IN_PROGRESS' && <span className="badge badge-inprogress">In Progress</span>}
                        {booking.status === 'COMPLETED' && <span className="badge badge-completed">Completed</span>}
                        {booking.status === 'REJECTED' && <span className="badge badge-rejected">Declined</span>}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Booking ID: #{booking.id} • Service Category: {booking.service?.category}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block' }}>Job Payout</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399' }}>
                        ₹{booking.totalAmount || booking.service?.price}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info Box */}
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px',
                    fontSize: '0.875rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} color="#fbbf24" />
                      <span>Customer: <strong>{booking.customer?.fullName || 'Client'}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} color="#fbbf24" />
                      <span>Phone: <strong>{booking.customer?.phone || '+91 99887 76655'}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="#fbbf24" />
                      <span>Date: <strong>{booking.bookingDate || 'Today'}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={16} color="#fbbf24" />
                      <span>Time Slot: <strong>{booking.timeSlot || 'Flexible'}</strong></span>
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-muted)' }}>
                      <MapPin size={16} color="#fbbf24" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>Service Location: <strong>{booking.customerAddress || booking.customer?.address || 'Customer Location'}</strong></span>
                    </div>

                    {booking.notes && (
                      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#a5b4fc', background: 'rgba(99,102,241,0.08)', padding: '8px 12px', borderRadius: '6px' }}>
                        <FileText size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>Issue description: "{booking.notes}"</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '16px'
                  }}>
                    {isPending && (
                      <>
                        <button
                          onClick={() => onUpdateBookingStatus(booking.id, 'REJECTED', 'Provider currently unavailable for this slot')}
                          className="btn btn-sm btn-danger"
                        >
                          <XCircle size={16} />
                          Decline Request
                        </button>
                        <button
                          onClick={() => onUpdateBookingStatus(booking.id, 'ACCEPTED', 'Technician dispatched and confirmed')}
                          className="btn btn-sm btn-primary-provider"
                        >
                          <CheckCircle size={16} />
                          Accept Service Request
                        </button>
                      </>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => onUpdateBookingStatus(booking.id, 'IN_PROGRESS', 'Technician arrived and began service')}
                        className="btn btn-sm"
                        style={{ background: '#8b5cf6', color: '#ffffff' }}
                      >
                        <Play size={16} />
                        Start Service (In Progress)
                      </button>
                    )}

                    {isInProgress && (
                      <button
                        onClick={() => onUpdateBookingStatus(booking.id, 'COMPLETED', 'Service finished and verified with customer')}
                        className="btn btn-sm"
                        style={{ background: '#10b981', color: '#ffffff' }}
                      >
                        <CheckCircle size={16} />
                        Mark as Completed
                      </button>
                    )}

                    {isCompleted && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.85rem', fontWeight: '600' }}>
                        <CheckCircle size={16} />
                        Job Successfully Closed & Paid
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
