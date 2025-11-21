// API Configuration
// Detect protocol and set appropriate base URL
const getApiBaseUrl = () => {
    // If opening from file:// protocol, use absolute URL
    if (window.location.protocol === 'file:') {
        console.warn('⚠️ Opening from file:// - Please access via http://localhost:8080');
        return 'http://localhost:8080/api';
    }
    // If served from web server, use relative URL
    return '/api';
};

const API_BASE_URL = getApiBaseUrl();
let authToken = null;
let currentUser = null;

// Helper function to get auth headers
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}

// Helper function to make authenticated requests with session cookies
async function makeRequest(url, options = {}) {
    const defaultOptions = {
        headers: getAuthHeaders(),
        credentials: 'include', // Include cookies for session-based auth
        ...options
    };
    
    try {
        console.log('Making request to:', url);
        const response = await fetch(url, defaultOptions);
        console.log('Response status:', response.status, 'for', url);
        
        if (response.status === 401) {
            // Unauthorized - redirect to login
            authToken = null;
            currentUser = null;
            document.getElementById('loginModal').classList.add('active');
            throw new Error('Session expired. Please login again.');
        }
        
        return response;
    } catch (error) {
        console.error('Request failed for:', url, error);
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Cannot connect to server. Please check if server is running on port 8080.');
        }
        throw error;
    }
}

// API Functions
const api = {
    // Auth APIs
    async login(username, password) {
        try {
            console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Include cookies for session
                body: JSON.stringify({ username, password })
            });
            console.log('Login response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Login failed:', errorText);
                throw new Error('Login failed: ' + errorText);
            }
            const data = await response.json();
            console.log('Login successful:', data);
            currentUser = data;
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        return await response.json();
    },

    async getCurrentUser() {
        try {
            const response = await makeRequest(`${API_BASE_URL}/auth/me`);
            if (!response.ok) throw new Error('Not authenticated');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Logout failed');
        authToken = null;
        currentUser = null;
        return await response.text();
    },

    // Customer APIs
    async getCustomers() {
        const response = await makeRequest(`${API_BASE_URL}/customers`);
        if (!response.ok) throw new Error('Failed to fetch customers');
        return await response.json();
    },

    async getCustomer(id) {
        const response = await makeRequest(`${API_BASE_URL}/customers/${id}`);
        if (!response.ok) throw new Error('Failed to fetch customer');
        return await response.json();
    },

    async createCustomer(data) {
        const response = await makeRequest(`${API_BASE_URL}/customers`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create customer');
        }
        return await response.json();
    },

    async updateCustomer(id, data) {
        const response = await makeRequest(`${API_BASE_URL}/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update customer');
        return await response.json();
    },

    async deleteCustomer(id) {
        const response = await makeRequest(`${API_BASE_URL}/customers/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete customer');
    },

    // Vehicle APIs
    async getVehicles() {
        const response = await makeRequest(`${API_BASE_URL}/vehicles`);
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        return await response.json();
    },

    async createVehicle(data) {
        const response = await makeRequest(`${API_BASE_URL}/vehicles`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create vehicle');
        }
        return await response.json();
    },

    async updateVehicle(id, data) {
        const response = await makeRequest(`${API_BASE_URL}/vehicles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update vehicle');
        return await response.json();
    },

    async deleteVehicle(id) {
        const response = await makeRequest(`${API_BASE_URL}/vehicles/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete vehicle');
    },

    // Employee APIs
    async getEmployees() {
        const response = await makeRequest(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Failed to fetch employees');
        return await response.json();
    },

    async createEmployee(data) {
        const response = await makeRequest(`${API_BASE_URL}/users`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create employee');
        }
        return await response.json();
    },

    async updateEmployee(id, data) {
        const response = await makeRequest(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update employee');
        return await response.json();
    },

    async deleteEmployee(id) {
        const response = await makeRequest(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete employee');
    },

    // Service Request APIs
    async getServiceRequests() {
        const response = await makeRequest(`${API_BASE_URL}/service-requests`);
        if (!response.ok) throw new Error('Failed to fetch service requests');
        return await response.json();
    },

    async createServiceRequest(data) {
        const response = await makeRequest(`${API_BASE_URL}/service-requests`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create service request');
        }
        return await response.json();
    },

    async updateServiceRequest(id, data) {
        const response = await makeRequest(`${API_BASE_URL}/service-requests/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update service request');
        return await response.json();
    },

    async deleteServiceRequest(id) {
        const response = await makeRequest(`${API_BASE_URL}/service-requests/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete service request');
    },

    // Service APIs
    async getServices() {
        const response = await makeRequest(`${API_BASE_URL}/services`);
        if (!response.ok) throw new Error('Failed to fetch services');
        return await response.json();
    },

    async createService(data) {
        const response = await makeRequest(`${API_BASE_URL}/services`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create service');
        }
        return await response.json();
    },

    async updateService(id, data) {
        const response = await makeRequest(`${API_BASE_URL}/services/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update service');
        return await response.json();
    },

    async deleteService(id) {
        const response = await makeRequest(`${API_BASE_URL}/services/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete service');
    },

    // Brand APIs
    async getBrands() {
        const response = await makeRequest(`${API_BASE_URL}/brands`);
        if (!response.ok) throw new Error('Failed to fetch brands');
        return await response.json();
    },

    async createBrand(data) {
        const response = await makeRequest(`${API_BASE_URL}/brands`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create brand');
        }
        return await response.json();
    },

    async updateBrand(id, data) {
        const response = await makeRequest(`${API_BASE_URL}/brands/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update brand');
        return await response.json();
    },

    async deleteBrand(id) {
        const response = await makeRequest(`${API_BASE_URL}/brands/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete brand');
    },

    // Invoice APIs
    async getInvoices() {
        const response = await makeRequest(`${API_BASE_URL}/invoices`);
        if (!response.ok) throw new Error('Failed to fetch invoices');
        return await response.json();
    },

    async getInvoice(id) {
        const response = await makeRequest(`${API_BASE_URL}/invoices/${id}`);
        if (!response.ok) throw new Error('Failed to fetch invoice');
        return await response.json();
    },

    async createInvoice(data) {
        const response = await makeRequest(`${API_BASE_URL}/invoices`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create invoice');
        }
        return await response.json();
    },

    async updateInvoice(id, data) {
        const response = await makeRequest(`${API_BASE_URL}/invoices/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update invoice');
        return await response.json();
    },

    async deleteInvoice(id) {
        const response = await makeRequest(`${API_BASE_URL}/invoices/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete invoice');
    },

    async getInvoicesByCustomer(customerId) {
        const response = await makeRequest(`${API_BASE_URL}/invoices/customer/${customerId}`);
        if (!response.ok) throw new Error('Failed to fetch invoices');
        return await response.json();
    }
};

