import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UserDashboard from './components/UserDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import AddServiceModal from './components/AddServiceModal';
import Toast from './components/Toast';
import api from './services/api';
import './App.css';

export default function App() {
  // Current logged in user (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('servizen_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Active view role: 'USER' or 'SERVICE_PROVIDER'
  const [activeRole, setActiveRole] = useState(() => {
    try {
      const saved = localStorage.getItem('servizen_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'SERVICE_PROVIDER' ? 'SERVICE_PROVIDER' : 'USER';
      }
    } catch {}
    return 'USER';
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState('explore'); // 'explore', 'user-bookings', 'provider-services', 'provider-bookings'

  // Data states
  const [allServices, setAllServices] = useState([]);
  const [providerServices, setProviderServices] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [providerBookings, setProviderBookings] = useState([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals
  const [authModal, setAuthModal] = useState({ isOpen: false, role: 'USER', mode: 'login' });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, service: null });
  const [addServiceModal, setAddServiceModal] = useState({ isOpen: false, editingService: null });

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch all active services for User marketplace
  const loadAllServices = useCallback(async () => {
    try {
      const data = await api.getAllServices(selectedCategory, searchQuery);
      setAllServices(data || []);
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  }, [selectedCategory, searchQuery]);

  // Fetch user bookings
  const loadUserBookings = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const data = await api.getUserBookings(userId);
      setUserBookings(data || []);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    }
  }, []);

  // Fetch provider data (their services + incoming bookings)
  const loadProviderData = useCallback(async (providerId) => {
    if (!providerId) return;
    try {
      const [servicesData, bookingsData] = await Promise.all([
        api.getProviderServices(providerId),
        api.getProviderBookings(providerId)
      ]);
      setProviderServices(servicesData || []);
      setProviderBookings(bookingsData || []);
    } catch (err) {
      console.error('Failed to load provider data:', err);
    }
  }, []);

  // Initial and reactive data fetching
  useEffect(() => {
    loadAllServices();
  }, [loadAllServices]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'USER') {
        loadUserBookings(currentUser.id);
      } else if (currentUser.role === 'SERVICE_PROVIDER') {
        loadProviderData(currentUser.id);
      }
    }
  }, [currentUser, loadUserBookings, loadProviderData]);

  // Auth handlers
  const handleAuthSuccess = (user, role) => {
    setCurrentUser(user);
    setActiveRole(role);
    localStorage.setItem('servizen_user', JSON.stringify(user));

    if (role === 'SERVICE_PROVIDER') {
      setActiveTab('provider-services');
      loadProviderData(user.id);
    } else {
      setActiveTab('explore');
      loadUserBookings(user.id);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('servizen_user');
    setUserBookings([]);
    setProviderServices([]);
    setProviderBookings([]);
    setActiveRole('USER');
    setActiveTab('explore');
    showToast('Logged out successfully.', 'info');
  };

  // User booking action
  const handleOpenBooking = (service) => {
    if (!currentUser) {
      setAuthModal({ isOpen: true, role: 'USER', mode: 'login' });
      showToast('Please sign in or register to book services.', 'info');
      return;
    }
    if (currentUser.role === 'SERVICE_PROVIDER') {
      showToast('Please switch to a User account to book services.', 'error');
      return;
    }
    setBookingModal({ isOpen: true, service });
  };

  // Provider status update (Accept, Start, Complete, Reject)
  const handleUpdateBookingStatus = async (bookingId, newStatus, notes) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus, notes);
      showToast(`Booking marked as ${newStatus}!`, 'success');
      if (currentUser?.id) {
        loadProviderData(currentUser.id);
        loadUserBookings(currentUser.id);
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  // Provider delete service
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(serviceId);
      showToast('Service deleted.', 'info');
      if (currentUser?.id) {
        loadProviderData(currentUser.id);
      }
      loadAllServices();
    } catch (err) {
      showToast(err.message || 'Failed to delete service', 'error');
    }
  };

  const pendingBookingsCount = providerBookings.filter(b => b.status === 'PENDING').length;
  const userBookingsCount = userBookings.length;

  return (
    <div className="app-container">
      {/* Background ambient lighting */}
      <div className="ambient-glow">
        <div className={`glow-1 ${activeRole === 'SERVICE_PROVIDER' ? 'glow-provider-1' : ''}`} />
        <div className="glow-2" />
      </div>

      {/* Navigation */}
      <Navbar
        user={currentUser}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(role, mode) => setAuthModal({ isOpen: true, role, mode })}
        onLogout={handleLogout}
        onOpenAddService={() => setAddServiceModal({ isOpen: true, editingService: null })}
        pendingBookingsCount={pendingBookingsCount}
        userBookingsCount={userBookingsCount}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {activeRole === 'USER' ? (
          <>
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onOpenAuth={(role, mode) => setAuthModal({ isOpen: true, role, mode })}
              user={currentUser}
            />

            <UserDashboard
              services={allServices}
              bookings={userBookings}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onBookService={handleOpenBooking}
              user={currentUser}
              onOpenAuth={(role, mode) => setAuthModal({ isOpen: true, role, mode })}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          </>
        ) : (
          <ProviderDashboard
            user={currentUser}
            providerServices={providerServices}
            providerBookings={providerBookings}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAddService={() => setAddServiceModal({ isOpen: true, editingService: null })}
            onEditService={(svc) => setAddServiceModal({ isOpen: true, editingService: svc })}
            onDeleteService={handleDeleteService}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onOpenAuth={(role, mode) => setAuthModal({ isOpen: true, role, mode })}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        padding: '32px 24px',
        textAlign: 'center',
        background: 'rgba(10, 14, 23, 0.95)',
        color: 'var(--text-dim)',
        fontSize: '0.85rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontWeight: '700', color: '#ffffff' }}>ServiZen Pro</span> — On-Demand AC Repair & Verified Home Services System
          </div>
          <div>
            Spring Boot 4.1 • React 19 • MySQL 8 • Dual-Role Architecture
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        initialRole={authModal.role}
        initialMode={authModal.mode}
        onAuthSuccess={handleAuthSuccess}
        showToast={showToast}
      />

      <BookingModal
        isOpen={bookingModal.isOpen}
        service={bookingModal.service}
        user={currentUser}
        onClose={() => setBookingModal({ isOpen: false, service: null })}
        onBookingSuccess={() => {
          if (currentUser?.id) {
            loadUserBookings(currentUser.id);
            setActiveTab('user-bookings');
          }
        }}
        onRequireLogin={(role) => setAuthModal({ isOpen: true, role, mode: 'login' })}
        showToast={showToast}
      />

      <AddServiceModal
        isOpen={addServiceModal.isOpen}
        onClose={() => setAddServiceModal({ isOpen: false, editingService: null })}
        user={currentUser}
        editingService={addServiceModal.editingService}
        onSuccess={() => {
          if (currentUser?.id) {
            loadProviderData(currentUser.id);
          }
          loadAllServices();
        }}
        showToast={showToast}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
