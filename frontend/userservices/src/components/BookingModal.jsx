import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, FileText, CheckCircle2, ShieldCheck, ArrowRight } from './Icons';
import api from '../services/api';

export default function BookingModal({ 
  service, 
  user, 
  isOpen, 
  onClose, 
  onBookingSuccess, 
  onRequireLogin,
  showToast 
}) {
  if (!isOpen || !service) return null;

  // Defaults
  const today = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState(today);
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '09:00 AM - 11:00 AM (Morning)',
    '11:00 AM - 01:00 PM (Mid-day)',
    '02:00 PM - 04:00 PM (Afternoon)',
    '04:00 PM - 06:00 PM (Evening)',
    '06:00 PM - 08:00 PM (Night Slot)'
  ];

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please log in with a User account to book services.', 'info');
      onRequireLogin('USER');
      return;
    }

    if (user.role === 'SERVICE_PROVIDER') {
      showToast('You are logged in as a Service Provider. Please switch to a User account to book services.', 'error');
      return;
    }

    if (!address.trim()) {
      showToast('Please provide your service address.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createBooking({
        customerId: user.id,
        serviceId: service.id,
        bookingDate,
        timeSlot,
        customerAddress: address,
        notes: notes.trim() || 'General service checkup requested.'
      });

      showToast('Service accepted and booking requested successfully!', 'success');
      onBookingSuccess(res);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to create booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#111827'
        }}>
          <div>
            <span className="badge badge-accepted" style={{ marginBottom: '6px' }}>
              Confirm & Accept Service
            </span>
            <h2 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
              {service.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleConfirm} style={{ padding: '24px' }}>
          {/* Provider & Price Summary Banner */}
          <div style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Assigned Technician:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                {service.provider?.businessName || service.provider?.fullName || 'Verified Pro'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                ★ {service.provider?.rating || 4.9} Rating • {service.duration || '60 Mins'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Payable Amount</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#34d399' }}>
                ₹{service.price}
              </div>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> Date
              </label>
              <input
                type="date"
                min={today}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Preferred Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="form-select"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Address */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} /> Service Delivery Address
            </label>
            <input
              type="text"
              required
              placeholder="House/Flat No., Apartment, Street, Landmark"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Problem description / notes */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} /> Specific Symptoms / Notes for Technician
            </label>
            <textarea
              placeholder="e.g., AC cooling is low, weird noise from outdoor unit, needs gas pressure check..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* Trust Guarantees */}
          <div style={{
            fontSize: '0.775rem',
            color: 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '20px'
          }}>
            <ShieldCheck size={16} color="#34d399" />
            <span>Pay securely on completion • Free cancellation up to 2 hours before</span>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-lg btn-primary-user"
            style={{ width: '100%' }}
          >
            {loading ? 'Confirming booking...' : (
              <>
                Confirm & Accept Service (₹{service.price})
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
