import axios from 'axios';

const API_URL = import.meta.env.PROD 
  ? 'https://your-production-api.com' 
  : 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  signup: (userData) => api.post('/api/auth/signup', userData),
};

export const events = {
  getMyEvents: () => api.get('/api/events/my'),
  createEvent: (eventData) => api.post('/api/events', eventData),
  updateEvent: (id, eventData) => api.put(`/api/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/api/events/${id}`),
};

export const swaps = {
  getSwappableSlots: () => api.get('/api/swappable-slots'),
  createSwapRequest: (data) => api.post('/api/swap-request', data),
  respondToSwapRequest: (requestId, response) =>
    api.post(`/api/swap-response/${requestId}`, { response }),
};

export default api;