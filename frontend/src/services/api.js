import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Service
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/auth/me', userData);
    return response.data;
  },
};

// Book Service
export const bookService = {
  getAll: async (params = {}) => {
    const response = await api.get('/books', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },
  
  create: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },
  
  update: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },
  
  getStatistics: async () => {
    const response = await api.get('/books/stats/overview');
    return response.data;
  },
};

// Member Service
export const memberService = {
  getAll: async (params = {}) => {
    const response = await api.get('/members', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },
  
  create: async (memberData) => {
    const response = await api.post('/members', memberData);
    return response.data;
  },
  
  update: async (id, memberData) => {
    const response = await api.put(`/members/${id}`, memberData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },
  
  getBorrowedBooks: async (id) => {
    const response = await api.get(`/members/${id}/borrowed-books`);
    return response.data;
  },
  
  payFine: async (id, paymentData) => {
    const response = await api.post(`/members/${id}/pay-fine`, paymentData);
    return response.data;
  },
};

// BorrowedBook Service
export const borrowService = {
  getAll: async (params = {}) => {
    const response = await api.get('/borrowed', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/borrowed/${id}`);
    return response.data;
  },
  
  borrowBook: async (borrowData) => {
    const response = await api.post('/borrowed', borrowData);
    return response.data;
  },
  
  returnBook: async (id, returnData) => {
    const response = await api.put(`/borrowed/${id}/return`, returnData);
    return response.data;
  },
  
  renewBook: async (id, renewData) => {
    const response = await api.put(`/borrowed/${id}/renew`, renewData);
    return response.data;
  },
  
  getStatistics: async () => {
    const response = await api.get('/borrowed/stats/overview');
    return response.data;
  },
};

// Reservation Service
export const reservationService = {
  getAll: async (params = {}) => {
    const response = await api.get('/reservations', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },
  
  create: async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },
  
  update: async (id, updateData) => {
    const response = await api.put(`/reservations/${id}`, updateData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },
  
  getPendingForBook: async (bookId) => {
    const response = await api.get(`/reservations/book/${bookId}/pending`);
    return response.data;
  },
}; 