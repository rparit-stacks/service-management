import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Request deduplication and response cache
const pendingRequests = new Map();
const requestTimestamps = new Map();
const responseCache = new Map();
const CACHE_DURATION = 10000; // 10 seconds cache - longer for dashboard
const DEDUPE_WINDOW = 5000; // 5 seconds deduplication window

// Helper function to deduplicate GET requests with response caching
const dedupeGetRequest = (requestKey, requestFn) => {
  const now = Date.now();
  
  // Check response cache first
  const cached = responseCache.get(requestKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return Promise.resolve(cached.response);
  }
  
  // Check if request is already pending
  if (pendingRequests.has(requestKey)) {
    const lastRequestTime = requestTimestamps.get(requestKey) || 0;
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < DEDUPE_WINDOW) {
      // Return existing promise if it's still within deduplication window
      return pendingRequests.get(requestKey);
    }
    // Clean up stale pending request
    pendingRequests.delete(requestKey);
    requestTimestamps.delete(requestKey);
  }
  
  // Create a new request promise
  const requestPromise = requestFn()
    .then((response) => {
      // Cache the response
      responseCache.set(requestKey, {
        response: response,
        timestamp: Date.now()
      });
      
      // Clean up after a delay
      setTimeout(() => {
        pendingRequests.delete(requestKey);
        requestTimestamps.delete(requestKey);
      }, 1000);
      
      return response;
    })
    .catch((error) => {
      // Clean up on error
      setTimeout(() => {
        pendingRequests.delete(requestKey);
        requestTimestamps.delete(requestKey);
      }, 1000);
      throw error;
    });
  
  // Store the pending request and timestamp
  pendingRequests.set(requestKey, requestPromise);
  requestTimestamps.set(requestKey, now);
  
  return requestPromise;
};

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't handle 401/403 in interceptor - let components handle it
    // This prevents infinite redirect loops
    return Promise.reject(error);
  }
);


// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Customer API
export const customerAPI = {
  getAll: () => dedupeGetRequest('GET_/customers', () => api.get('/customers')),
  getById: (id) => dedupeGetRequest(`GET_/customers/${id}`, () => api.get(`/customers/${id}`)),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Vehicle API
export const vehicleAPI = {
  getAll: () => dedupeGetRequest('GET_/vehicles', () => api.get('/vehicles')),
  getById: (id) => dedupeGetRequest(`GET_/vehicles/${id}`, () => api.get(`/vehicles/${id}`)),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

// Service Request API
export const serviceRequestAPI = {
  getAll: () => dedupeGetRequest('GET_/service-requests', () => api.get('/service-requests')),
  getById: (id) => dedupeGetRequest(`GET_/service-requests/${id}`, () => api.get(`/service-requests/${id}`)),
  create: (data) => api.post('/service-requests', data),
  update: (id, data) => api.put(`/service-requests/${id}`, data),
  delete: (id) => api.delete(`/service-requests/${id}`),
};

// Service/Job API
export const serviceAPI = {
  getAll: () => dedupeGetRequest('GET_/services', () => api.get('/services')),
  getById: (id) => dedupeGetRequest(`GET_/services/${id}`, () => api.get(`/services/${id}`)),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Invoice API
export const invoiceAPI = {
  getAll: () => dedupeGetRequest('GET_/invoices', () => api.get('/invoices')),
  getById: (id) => dedupeGetRequest(`GET_/invoices/${id}`, () => api.get(`/invoices/${id}`)),
  getByNumber: (number) => dedupeGetRequest(`GET_/invoices/number/${number}`, () => api.get(`/invoices/number/${number}`)),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  download: (id) => {
    window.open(`http://localhost:8080/print/invoice/${id}`, '_blank');
  },
  print: (id) => {
    window.open(`http://localhost:8080/print/invoice/${id}`, '_blank');
  },
};

// User API (for employees/admins)
export const userAPI = {
  getAll: () => dedupeGetRequest('GET_/users', () => api.get('/users')),
  getById: (id) => dedupeGetRequest(`GET_/users/${id}`, () => api.get(`/users/${id}`)),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Service Template API (Master list of services)
export const serviceTemplateAPI = {
  getAll: () => dedupeGetRequest('GET_/service-templates', () => api.get('/service-templates')),
  getActive: () => dedupeGetRequest('GET_/service-templates/active', () => api.get('/service-templates/active')),
  getById: (id) => dedupeGetRequest(`GET_/service-templates/${id}`, () => api.get(`/service-templates/${id}`)),
  create: (data) => api.post('/service-templates', data),
  update: (id, data) => api.put(`/service-templates/${id}`, data),
  delete: (id) => api.delete(`/service-templates/${id}`),
};

export default api;

