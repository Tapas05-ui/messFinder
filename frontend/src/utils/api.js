import axios from 'axios';

const BASE_URL = 'https://messfinder-eepq.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

export const messAPI = {
  getAll: (params) => api.get('/api/mess', { params }),
  getById: (id) => api.get(`/api/mess/${id}`),
  getMyListings: () => api.get('/api/mess/owner/my-listings'),
  create: (data) => api.post('/api/mess', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/api/mess/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/api/mess/${id}`),
  toggleAvailability: (id) => api.patch(`/api/mess/${id}/availability`),
  removePhoto: (id, photoUrl) => api.delete(`/api/mess/${id}/photos`, { data: { photoUrl } }),
  addReview: (id, data) => api.post(`/api/mess/${id}/review`, data),
};

export const bookingAPI = {
  create: (data) => api.post('/api/bookings', data),
  getMyBookings: () => api.get('/api/bookings/my'),
  getOwnerBookings: () => api.get('/api/bookings/owner'),
  updateStatus: (id, data) => api.patch(`/api/bookings/${id}/status`, data),
  cancel: (id) => api.patch(`/api/bookings/${id}/cancel`),
};

export const userAPI = {
  updateProfile: (data) => api.put('/api/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getFavourites: () => api.get('/api/users/favourites'),
  toggleFavourite: (messId) => api.post(`/api/users/favourites/${messId}`),
};

export const notificationAPI = {
  getAll: () => api.get('/api/notifications'),
  markAsRead: (ids) => api.patch('/api/notifications/read', { ids }),
};

export const adminAPI = {
  getStats: () => api.get('/api/admin/stats'),
  getPendingOwners: () => api.get('/api/admin/owners/pending'),
  updateOwnerApproval: (id, action) => api.patch(`/api/admin/owners/${id}/approval`, { action }),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  toggleUserStatus: (id) => api.patch(`/api/admin/users/${id}/toggle`),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  getAllMess: () => api.get('/api/admin/mess'),
  getAllBookings: () => api.get('/api/admin/bookings'),
};
