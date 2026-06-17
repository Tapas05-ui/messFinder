import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://messfinder-eepq.onrender.com/api';

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
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const messAPI = {
  getAll: (params) => api.get('/mess', { params }),
  getById: (id) => api.get(`/mess/${id}`),
  getMyListings: () => api.get('/mess/owner/my-listings'),
  create: (data) => api.post('/mess', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/mess/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/mess/${id}`),
  toggleAvailability: (id) => api.patch(`/mess/${id}/availability`),
  removePhoto: (id, photoUrl) => api.delete(`/mess/${id}/photos`, { data: { photoUrl } }),
  addReview: (id, data) => api.post(`/mess/${id}/review`, data),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getOwnerBookings: () => api.get('/bookings/owner'),
  updateStatus: (id, data) => api.patch(`/bookings/${id}/status`, data),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getFavourites: () => api.get('/users/favourites'),
  toggleFavourite: (messId) => api.post(`/users/favourites/${messId}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (ids) => api.patch('/notifications/read', { ids }),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getPendingOwners: () => api.get('/admin/owners/pending'),
  updateOwnerApproval: (id, action) => api.patch(`/admin/owners/${id}/approval`, { action }),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllMess: () => api.get('/admin/mess'),
  getAllBookings: () => api.get('/admin/bookings'),
};
