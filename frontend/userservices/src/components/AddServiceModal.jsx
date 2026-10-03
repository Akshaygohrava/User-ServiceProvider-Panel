import React, { useState, useEffect } from 'react';
import { X, Plus, Wind, Sparkles, Image, Clock, Tag, IndianRupee, ArrowRight } from './Icons';
import api from '../services/api';

export default function AddServiceModal({ 
  isOpen, 
  onClose, 
  user, 
  editingService = null, 
  onSuccess, 
  showToast 
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    title: '',
    category: 'AC Repair',
    description: '',
    price: '',
    duration: '60 Mins',
    imageUrl: '',
    status: 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingService) {
      setFormData({
        title: editingService.title || '',
        category: editingService.category || 'AC Repair',
        description: editingService.description || '',
        price: editingService.price || '',
        duration: editingService.duration || '60 Mins',
        imageUrl: editingService.imageUrl || '',
        status: editingService.status || 'ACTIVE'
      });
    } else {
      setFormData({
        title: '',
        category: 'AC Repair',
        description: '',
        price: '',
        duration: '60 Mins',
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        status: 'ACTIVE'
      });
    }
  }, [editingService, isOpen]);

  const presets = [
    {
      label: 'AC Jet Cleaning',
      title: 'Split AC Pressure Jet Cleaning & Sanitization',
      category: 'AC Repair',
      price: 599,
      duration: '60 Mins',
      description: 'High-power water jacket jet cleaning of evaporator coils, filter scrub, blower cleanup & cooling disinfectant.',
      imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
    },
    {
      label: 'AC Gas Refill',
      title: 'AC Gas Leak Detection & Refrigerant Top-up',
      category: 'AC Repair',
      price: 1499,
      duration: '90 Mins',
      description: 'Comprehensive nitrogen/electronic leak search, brazing leak repair, moisture vacuuming & 100% genuine R32/R410A gas refill.',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
    },
    {
      label: 'PCB Diagnostics',
      title: 'Inverter AC PCB Circuit Board Diagnostics',
      category: 'AC Repair',
      price: 899,
      duration: '75 Mins',
      description: 'Inverter sensor diagnostics, motherboard error code reading, micro-controller relay repair & power surge protection.',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const applyPreset = (preset) => {
    setFormData({
      title: preset.title,
      category: preset.category,
      price: preset.price,
      duration: preset.duration,
      description: preset.description,
      imageUrl: preset.imageUrl,
      status: 'ACTIVE'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'SERVICE_PROVIDER') {
      showToast('Only service providers can add services.', 'error');
      return;
    }

    if (!formData.title || !formData.price) {
      showToast('Please enter service title and price.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingService) {
        await api.updateService(editingService.id, {
          ...formData,
          price: parseFloat(formData.price)
        });
        showToast('Service updated successfully!', 'success');
      } else {
        await api.createService({
          ...formData,
          providerId: user.id,
          price: parseFloat(formData.price)
        });
        showToast('New service published successfully!', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to save service', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
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
            <span className="badge badge-pending" style={{ marginBottom: '6px' }}>
              Service Provider Studio
            </span>
            <h2 style={{ fontSize: '1.3rem', color: '#ffffff' }}>
              {editingService ? 'Edit Service' : 'Add New Service Offering'}
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

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Quick AC Presets */}
          {!editingService && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#f59e0b" />
                <span>Quick AC Repair Templates (Click to pre-fill):</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    ⚡ {preset.label} (₹{preset.price})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Service Title */}
          <div className="form-group">
            <label className="form-label">Service Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Split AC Complete Master Servicing & Filter Scrub"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>

          {/* Category & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                <option value="AC Repair">AC Repair & HVAC</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Cleaning">Deep Cleaning</option>
                <option value="Appliance">Home Appliances</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Estimated Duration</label>
              <input
                type="text"
                placeholder="e.g., 60 Mins, 90 Mins, 2 Hours"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* Price & Image URL */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '14px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Price (₹ INR)</label>
              <input
                type="number"
                required
                min="0"
                step="1"
                placeholder="599"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description of What's Included</label>
            <textarea
              required
              rows={4}
              placeholder="Detail what is included in this service (e.g., jet wash, antibacterial disinfectant, coil wash, refrigerant pressure check)..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-lg btn-primary-provider"
            style={{ width: '100%', marginTop: '10px' }}
          >
            {loading ? 'Saving...' : (
              <>
                {editingService ? 'Update Service' : 'Publish Service to Marketplace'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
