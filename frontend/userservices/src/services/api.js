const API_BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Authentication
  registerUser: (userData) => request('/auth/register/user', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  registerProvider: (providerData) => request('/auth/register/provider', {
    method: 'POST',
    body: JSON.stringify(providerData),
  }),

  loginUser: (credentials) => request('/auth/login/user', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  loginProvider: (credentials) => request('/auth/login/provider', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  getUserProfile: (userId) => request(`/auth/profile/${userId}`),

  // Services
  getAllServices: (category = '', search = '') => {
    const params = new URLSearchParams();
    if (category && category !== 'ALL') params.append('category', category);
    if (search) params.append('search', search);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/services${queryString}`);
  },

  getServiceById: (id) => request(`/services/${id}`),

  getProviderServices: (providerId) => request(`/services/provider/${providerId}`),

  createService: (serviceData) => request('/services', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  }),

  updateService: (id, serviceData) => request(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  }),

  deleteService: (id) => request(`/services/${id}`, {
    method: 'DELETE',
  }),

  // Bookings
  createBooking: (bookingData) => request('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  getUserBookings: (userId) => request(`/bookings/user/${userId}`),

  getProviderBookings: (providerId) => request(`/bookings/provider/${providerId}`),

  updateBookingStatus: (bookingId, status, notes = '') => request(`/bookings/${bookingId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  }),
};

export default api;
