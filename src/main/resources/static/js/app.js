// Application State
let currentSection = 'dashboard';
let editingId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Check if opening from file:// protocol
    if (window.location.protocol === 'file:') {
        alert('⚠️ Please access this application via http://localhost:8080\n\nDo not open the HTML file directly from the file system.\n\nStart the Spring Boot server and then open:\nhttp://localhost:8080');
    }
    checkAuth();
    setupEventListeners();
});

// Check Authentication
async function checkAuth() {
    try {
        const user = await api.getCurrentUser();
        currentUser = user;
        document.getElementById('username').textContent = user.username;
        document.getElementById('loginModal').classList.remove('active');
        loadDashboard();
    } catch (error) {
        console.error('Auth check failed:', error);
        document.getElementById('loginModal').classList.add('active');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Navigation
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    
    // Show selected section
    document.getElementById(section).classList.add('active');
    event.target.classList.add('active');
    
    currentSection = section;
    
    // Load data for the section
    switch(section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'vehicles':
            loadVehicles();
            break;
        case 'employees':
            loadEmployees();
            break;
        case 'service-requests':
            loadServiceRequests();
            break;
        case 'services':
            loadServices();
            break;
        case 'brands':
            loadBrands();
            break;
        case 'invoices':
            loadInvoices();
            break;
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Authentication
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await api.login(username, password);
        showToast('Login successful!', 'success');
        document.getElementById('loginModal').classList.remove('active');
        document.getElementById('loginForm').reset();
        checkAuth();
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || 'Login failed. Please check your credentials.', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const data = {
        username: document.getElementById('registerUsername').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        role: document.getElementById('registerRole').value
    };
    
    try {
        await api.register(data);
        showToast('Registration successful! Please login.', 'success');
        showLogin();
    } catch (error) {
        showToast(error.message || 'Registration failed', 'error');
    }
}

function showLogin() {
    document.getElementById('registerModal').classList.remove('active');
    document.getElementById('loginModal').classList.add('active');
}

function showRegister() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('registerModal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('active');
}

async function logout() {
    try {
        await api.logout();
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        showToast('Logout failed', 'error');
    }
}

// Dashboard
async function loadDashboard() {
    try {
        const [customers, vehicles, serviceRequests, services] = await Promise.all([
            api.getCustomers().catch(() => []),
            api.getVehicles().catch(() => []),
            api.getServiceRequests().catch(() => []),
            api.getServices().catch(() => [])
        ]);
        
        document.getElementById('totalCustomers').textContent = customers.length;
        document.getElementById('totalVehicles').textContent = vehicles.length;
        document.getElementById('totalServiceRequests').textContent = serviceRequests.length;
        document.getElementById('totalServices').textContent = services.length;
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

// Customers
async function loadCustomers() {
    try {
        const customers = await api.getCustomers();
        const tbody = document.getElementById('customersTableBody');
        tbody.innerHTML = '';
        
        if (customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No customers found</td></tr>';
            return;
        }
        
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.fullName}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${customer.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        document.getElementById('customersTableBody').innerHTML = 
            `<tr><td colspan="5" class="loading">Error: ${error.message}</td></tr>`;
    }
}

function openCustomerModal(id = null) {
    editingId = id;
    document.getElementById('customerModalTitle').innerHTML = 
        id ? '<i class="fas fa-edit"></i> Edit Customer' : '<i class="fas fa-user-plus"></i> Add Customer';
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = id || '';
    
    if (id) {
        api.getCustomer(id).then(customer => {
            document.getElementById('customerFullName').value = customer.fullName;
            document.getElementById('customerEmail').value = customer.email;
            document.getElementById('customerPhone').value = customer.phone;
        });
    }
    
    document.getElementById('customerModal').classList.add('active');
}

function closeCustomerModal() {
    document.getElementById('customerModal').classList.remove('active');
    editingId = null;
}

async function handleCustomerSubmit(event) {
    event.preventDefault();
    const data = {
        fullName: document.getElementById('customerFullName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value
    };
    
    try {
        if (editingId) {
            await api.updateCustomer(editingId, data);
            showToast('Customer updated successfully', 'success');
        } else {
            await api.createCustomer(data);
            showToast('Customer created successfully', 'success');
        }
        closeCustomerModal();
        loadCustomers();
    } catch (error) {
        showToast(error.message || 'Operation failed', 'error');
    }
}

function editCustomer(id) {
    openCustomerModal(id);
}

async function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
        await api.deleteCustomer(id);
        showToast('Customer deleted successfully', 'success');
        loadCustomers();
    } catch (error) {
        showToast(error.message || 'Delete failed', 'error');
    }
}

// Vehicles
async function loadVehicles() {
    try {
        const [vehicles, customers, brands] = await Promise.all([
            api.getVehicles(),
            api.getCustomers().catch(() => []),
            api.getBrands().catch(() => [])
        ]);
        
        // Populate dropdowns
        const customerSelect = document.getElementById('vehicleCustomerId');
        customerSelect.innerHTML = '<option value="">Select Customer</option>';
        customers.forEach(c => {
            customerSelect.innerHTML += `<option value="${c.id}">${c.fullName}</option>`;
        });
        
        const brandSelect = document.getElementById('vehicleBrandId');
        brandSelect.innerHTML = '<option value="">Select Brand</option>';
        brands.forEach(b => {
            brandSelect.innerHTML += `<option value="${b.id}">${b.name}</option>`;
        });
        
        const tbody = document.getElementById('vehiclesTableBody');
        tbody.innerHTML = '';
        
        if (vehicles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">No vehicles found</td></tr>';
            return;
        }
        
        vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vehicle.id}</td>
                <td>${vehicle.number}</td>
                <td>${vehicle.brandName || 'N/A'}</td>
                <td>${vehicle.model || 'N/A'}</td>
                <td>${vehicle.type || 'N/A'}</td>
                <td>${vehicle.customerName || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="editVehicle(${vehicle.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteVehicle(${vehicle.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        document.getElementById('vehiclesTableBody').innerHTML = 
            `<tr><td colspan="7" class="loading">Error: ${error.message}</td></tr>`;
    }
}

function openVehicleModal(id = null) {
    editingId = id;
    document.getElementById('vehicleModalTitle').innerHTML = 
        id ? '<i class="fas fa-edit"></i> Edit Vehicle' : '<i class="fas fa-car"></i> Add Vehicle';
    document.getElementById('vehicleForm').reset();
    document.getElementById('vehicleId').value = id || '';
    
    // Reload dropdowns
    loadVehicles().then(() => {
        if (id) {
            api.getVehicles().then(vehicles => {
                const vehicle = vehicles.find(v => v.id === id);
                if (vehicle) {
                    document.getElementById('vehicleNumber').value = vehicle.number;
                    document.getElementById('vehicleModel').value = vehicle.model || '';
                    document.getElementById('vehicleType').value = vehicle.type || '';
                    document.getElementById('vehicleCustomerId').value = vehicle.customerId;
                    document.getElementById('vehicleBrandId').value = vehicle.brandId || '';
                }
            });
        }
    });
    
    document.getElementById('vehicleModal').classList.add('active');
}

function closeVehicleModal() {
    document.getElementById('vehicleModal').classList.remove('active');
    editingId = null;
}

async function handleVehicleSubmit(event) {
    event.preventDefault();
    const data = {
        number: document.getElementById('vehicleNumber').value,
        model: document.getElementById('vehicleModel').value,
        type: document.getElementById('vehicleType').value,
        customerId: parseInt(document.getElementById('vehicleCustomerId').value),
        brandId: document.getElementById('vehicleBrandId').value ? 
                 parseInt(document.getElementById('vehicleBrandId').value) : null
    };
    
    try {
        if (editingId) {
            await api.updateVehicle(editingId, data);
            showToast('Vehicle updated successfully', 'success');
        } else {
            await api.createVehicle(data);
            showToast('Vehicle created successfully', 'success');
        }
        closeVehicleModal();
        loadVehicles();
    } catch (error) {
        showToast(error.message || 'Operation failed', 'error');
    }
}

function editVehicle(id) {
    openVehicleModal(id);
}

async function deleteVehicle(id) {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
        await api.deleteVehicle(id);
        showToast('Vehicle deleted successfully', 'success');
        loadVehicles();
    } catch (error) {
        showToast(error.message || 'Delete failed', 'error');
    }
}

// Employees
async function loadEmployees() {
    try {
        const employees = await api.getEmployees();
        const tbody = document.getElementById('employeesTableBody');
        tbody.innerHTML = '';
        
        if (employees.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No employees found</td></tr>';
            return;
        }
        
        employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.fullName}</td>
                <td>${employee.email}</td>
                <td>${employee.phone}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="editEmployee(${employee.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${employee.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        document.getElementById('employeesTableBody').innerHTML = 
            `<tr><td colspan="5" class="loading">Error: ${error.message}</td></tr>`;
    }
}

function openEmployeeModal(id = null) {
    editingId = id;
    document.getElementById('employeeModalTitle').innerHTML = 
        id ? '<i class="fas fa-edit"></i> Edit Employee' : '<i class="fas fa-user-plus"></i> Add Employee';
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeId').value = id || '';
    
    if (id) {
        api.getEmployees().then(employees => {
            const employee = employees.find(e => e.id === id);
            if (employee) {
                document.getElementById('employeeFullName').value = employee.fullName;
                document.getElementById('employeeEmail').value = employee.email;
                document.getElementById('employeePhone').value = employee.phone;
            }
        });
    }
    
    document.getElementById('employeeModal').classList.add('active');
}

function closeEmployeeModal() {
    document.getElementById('employeeModal').classList.remove('active');
    editingId = null;
}

async function handleEmployeeSubmit(event) {
    event.preventDefault();
    const data = {
        fullName: document.getElementById('employeeFullName').value,
        email: document.getElementById('employeeEmail').value,
        phone: document.getElementById('employeePhone').value
    };
    
    try {
        if (editingId) {
            await api.updateEmployee(editingId, data);
            showToast('Employee updated successfully', 'success');
        } else {
            await api.createEmployee(data);
            showToast('Employee created successfully', 'success');
        }
        closeEmployeeModal();
        loadEmployees();
    } catch (error) {
        showToast(error.message || 'Operation failed', 'error');
    }
}

function editEmployee(id) {
    openEmployeeModal(id);
}

async function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
        await api.deleteEmployee(id);
        showToast('Employee deleted successfully', 'success');
        loadEmployees();
    } catch (error) {
        showToast(error.message || 'Delete failed', 'error');
    }
}

// Service Requests
async function loadServiceRequests() {
    try {
        const [serviceRequests, vehicles] = await Promise.all([
            api.getServiceRequests(),
            api.getVehicles().catch(() => [])
        ]);
        
        // Populate dropdown
        const vehicleSelect = document.getElementById('serviceRequestVehicleId');
        vehicleSelect.innerHTML = '<option value="">Select Vehicle</option>';
        vehicles.forEach(v => {
            vehicleSelect.innerHTML += `<option value="${v.id}">${v.number} - ${v.customerName}</option>`;
        });
        
        const tbody = document.getElementById('serviceRequestsTableBody');
        tbody.innerHTML = '';
        
        if (serviceRequests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No service requests found</td></tr>';
            return;
        }
        
        serviceRequests.forEach(sr => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sr.id}</td>
                <td>${sr.description || 'N/A'}</td>
                <td><span class="badge ${sr.status.toLowerCase().replace('_', '-')}">${sr.status}</span></td>
                <td>${sr.vehicleNumber || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="editServiceRequest(${sr.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteServiceRequest(${sr.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        document.getElementById('serviceRequestsTableBody').innerHTML = 
            `<tr><td colspan="5" class="loading">Error: ${error.message}</td></tr>`;
    }
}

function openServiceRequestModal(id = null) {
    editingId = id;
    document.getElementById('serviceRequestModalTitle').innerHTML = 
        id ? '<i class="fas fa-edit"></i> Edit Service Request' : '<i class="fas fa-clipboard-list"></i> Add Service Request';
    document.getElementById('serviceRequestForm').reset();
    document.getElementById('serviceRequestId').value = id || '';
    
    loadServiceRequests().then(() => {
        if (id) {
            api.getServiceRequests().then(requests => {
                const request = requests.find(r => r.id === id);
                if (request) {
                    document.getElementById('serviceRequestDescription').value = request.description || '';
                    document.getElementById('serviceRequestStatus').value = request.status;
                    document.getElementById('serviceRequestVehicleId').value = request.vehicleId;
                }
            });
        }
    });
    
    document.getElementById('serviceRequestModal').classList.add('active');
}

function closeServiceRequestModal() {
    document.getElementById('serviceRequestModal').classList.remove('active');
    editingId = null;
}

async function handleServiceRequestSubmit(event) {
    event.preventDefault();
    const data = {
        description: document.getElementById('serviceRequestDescription').value,
        status: document.getElementById('serviceRequestStatus').value,
        vehicleId: parseInt(document.getElementById('serviceRequestVehicleId').value)
    };
    
    try {
        if (editingId) {
            await api.updateServiceRequest(editingId, data);
            showToast('Service request updated successfully', 'success');
        } else {
            await api.createServiceRequest(data);
            showToast('Service request created successfully', 'success');
        }
        closeServiceRequestModal();
        loadServiceRequests();
    } catch (error) {
        showToast(error.message || 'Operation failed', 'error');
    }
}

function editServiceRequest(id) {
    openServiceRequestModal(id);
}

async function deleteServiceRequest(id) {
    if (!confirm('Are you sure you want to delete this service request?')) return;
    
    try {
        await api.deleteServiceRequest(id);
        showToast('Service request deleted successfully', 'success');
        loadServiceRequests();
    } catch (error) {
        showToast(error.message || 'Delete failed', 'error');
    }
}

// Services
async function loadServices() {
    try {
        const [services, serviceRequests, employees] = await Promise.all([
            api.getServices(),
            api.getServiceRequests().catch(() => []),
            api.getEmployees().catch(() => [])
        ]);
        
        // Populate dropdowns
        const srSelect = document.getElementById('serviceServiceRequestId');
        srSelect.innerHTML = '<option value="">Select Service Request</option>';
        serviceRequests.forEach(sr => {
            srSelect.innerHTML += `<option value="${sr.id}">#${sr.id} - ${sr.vehicleNumber}</option>`;
        });
        
        const empSelect = document.getElementById('serviceUserId');
        empSelect.innerHTML = '<option value="">Select Employee</option>';
        employees.forEach(e => {
            empSelect.innerHTML += `<option value="${e.id}">${e.fullName}</option>`;
        });
        
        const tbody = document.getElementById('servicesTableBody');
        tbody.innerHTML = '';
        
        if (services.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading">No services found</td></tr>';
            return;
        }
        
        services.forEach(service => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.id}</td>
                <td>${service.jobName}</td>
                <td>${service.description || 'N/A'}</td>
                <td>$${service.cost.toFixed(2)}</td>
                <td>${service.userName || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="editService(${service.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteService(${service.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        document.getElementById('servicesTableBody').innerHTML = 
            `<tr><td colspan="6" class="loading">Error: ${error.message}</td></tr>`;
    }
}

function openServiceModal(id = null) {
    editingId = id;
    document.getElementById('serviceModalTitle').innerHTML = 
        id ? '<i class="fas fa-edit"></i> Edit Service' : '<i class="fas fa-tools"></i> Add Service';
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = id || '';
    
    loadServices().then(() => {
        if (id) {
            api.getServices().then(services => {
                const service = services.find(s => s.id === id);
                if (service) {
                    document.getElementById('serviceJobName').value = service.jobName;
                    document.getElementById('serviceDescription').value = service.description || '';
                    document.getElementById('serviceCost').value = service.cost;
                    document.getElementById('serviceServiceRequestId').value = service.serviceRequestId;
                    document.getElementById('serviceUserId').value = service.userId;
                }
            });
        }
    });
    
    document.getElementById('serviceModal').classList.add('active');
}

function closeServiceModal() {
    document.getElementById('serviceModal').classList.remove('active');
    editingId = null;
}

async function handleServiceSubmit(event) {
    event.preventDefault();
    const data = {
        jobName: document.getElementById('serviceJobName').value,
        description: document.getElementById('serviceDescription').value,
        cost: parseFloat(document.getElementById('serviceCost').value),
        serviceRequestId: parseInt(document.getElementById('serviceServiceRequestId').value),
        userId: parseInt(document.getElementById('serviceUserId').value)
    };
    
    try {
        if (editingId) {
            await api.updateService(editingId, data);
            showToast('Service updated successfully', 'success');
        } else {
            await api.createService(data);
            showToast('Service created successfully', 'success');
        }
        closeServiceModal();
        loadServices();
    } catch (error) {
        showToast(error.message || 'Operation failed', 'error');
    }
}

function editService(id) {
    openServiceModal(id);
}

async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
        await api.deleteService(id);
        showToast('Service deleted successfully', 'success');
        loadServices();
    } catch (error) {
        showToast(error.message || 'Delete failed', 'error');
    }
}

// Brands
async function loadBrands() {
    try {
        const brands = await api.getBrands();
        const tbody = document.getElementById('brandsTableBody');
        tbody.innerHTML = '';
        
        if (brands.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No brands found</td></tr>';
            return;
        }
        
        brands.forEach(brand => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${brand.id}</td>
                <td>${brand.name}</td>
                <td>${brand.description || 'N/A'}</td>
                <td>${brand.country || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="editBrand(${brand.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteBrand(${brand.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        document.getElementById('brandsTableBody').innerHTML = 
            `<tr><td colspan="5" class="loading">Error: ${error.message}</td></tr>`;
    }
}

function openBrandModal(id = null) {
    editingId = id;
    document.getElementById('brandModalTitle').innerHTML = 
        id ? '<i class="fas fa-edit"></i> Edit Brand' : '<i class="fas fa-tag"></i> Add Brand';
    document.getElementById('brandForm').reset();
    document.getElementById('brandId').value = id || '';
    
    if (id) {
        api.getBrands().then(brands => {
            const brand = brands.find(b => b.id === id);
            if (brand) {
                document.getElementById('brandName').value = brand.name;
                document.getElementById('brandDescription').value = brand.description || '';
                document.getElementById('brandCountry').value = brand.country || '';
            }
        });
    }
    
    document.getElementById('brandModal').classList.add('active');
}

function closeBrandModal() {
    document.getElementById('brandModal').classList.remove('active');
    editingId = null;
}

async function handleBrandSubmit(event) {
    event.preventDefault();
    const data = {
        name: document.getElementById('brandName').value,
        description: document.getElementById('brandDescription').value,
        country: document.getElementById('brandCountry').value
    };
    
    try {
        if (editingId) {
            await api.updateBrand(editingId, data);
            showToast('Brand updated successfully', 'success');
        } else {
            await api.createBrand(data);
            showToast('Brand created successfully', 'success');
        }
        closeBrandModal();
        loadBrands();
    } catch (error) {
        showToast(error.message || 'Operation failed', 'error');
    }
}

function editBrand(id) {
    openBrandModal(id);
}

async function deleteBrand(id) {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    try {
        await api.deleteBrand(id);
        showToast('Brand deleted successfully', 'success');
        loadBrands();
    } catch (error) {
        showToast(error.message || 'Delete failed', 'error');
    }
}

// Invoices
async function loadInvoices() {
    try {
        const invoices = await api.getInvoices();
        const tbody = document.getElementById('invoicesTableBody');
        tbody.innerHTML = '';
        
        if (invoices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">No invoices found</td></tr>';
            return;
        }
        
            invoices.forEach(invoice => {
            const row = document.createElement('tr');
            const date = new Date(invoice.createdAt).toLocaleDateString();
            const paymentStatusClass = invoice.paymentStatus === 'PAID' ? 'paid' : 'unpaid';
            row.innerHTML = `
                <td>${invoice.invoiceNumber}</td>
                <td>${invoice.customerName}</td>
                <td>${invoice.vehicleNumber}</td>
                <td>$${invoice.totalAmount.toFixed(2)}</td>
                <td><span class="badge ${paymentStatusClass}">${invoice.paymentStatus}</span></td>
                <td>${date}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="printInvoice(${invoice.id})">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="btn btn-info btn-sm" onclick="viewInvoice(${invoice.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editInvoice(${invoice.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteInvoice(${invoice.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        document.getElementById('invoicesTableBody').innerHTML = 
            `<tr><td colspan="7" class="loading">Error: ${error.message}</td></tr>`;
    }
}

function openInvoiceModal(id = null) {
    editingId = id;
    document.getElementById('invoiceModalTitle').innerHTML = 
        id ? '<i class="fas fa-edit"></i> Edit Invoice' : '<i class="fas fa-file-invoice"></i> Generate Invoice';
    document.getElementById('invoiceForm').reset();
    document.getElementById('invoiceId').value = id || '';
    
    // Load service requests
    api.getServiceRequests().then(requests => {
        const select = document.getElementById('invoiceServiceRequestId');
        select.innerHTML = '<option value="">Select Service Request</option>';
        requests.forEach(sr => {
            if (sr.status === 'COMPLETED' || sr.status === 'IN_PROGRESS') {
                select.innerHTML += `<option value="${sr.id}">#${sr.id} - ${sr.vehicleNumber}</option>`;
            }
        });
        
        if (id) {
            api.getInvoice(id).then(invoice => {
                document.getElementById('invoiceServiceRequestId').value = invoice.serviceRequestId;
                document.getElementById('invoiceTax').value = invoice.tax || 0;
                document.getElementById('invoiceDiscount').value = invoice.discount || 0;
                document.getElementById('invoiceDueDays').value = 30;
                document.getElementById('invoicePaymentStatus').value = invoice.paymentStatus;
                document.getElementById('invoiceNotes').value = invoice.notes || '';
            });
        }
    });
    
    document.getElementById('invoiceModal').classList.add('active');
}

function closeInvoiceModal() {
    document.getElementById('invoiceModal').classList.remove('active');
    editingId = null;
}

async function handleInvoiceSubmit(event) {
    event.preventDefault();
    const data = {
        serviceRequestId: parseInt(document.getElementById('invoiceServiceRequestId').value),
        tax: parseFloat(document.getElementById('invoiceTax').value) || 0,
        discount: parseFloat(document.getElementById('invoiceDiscount').value) || 0,
        dueDays: parseInt(document.getElementById('invoiceDueDays').value) || 30,
        paymentStatus: document.getElementById('invoicePaymentStatus').value,
        notes: document.getElementById('invoiceNotes').value
    };
    
    try {
        if (editingId) {
            await api.updateInvoice(editingId, data);
            showToast('Invoice updated successfully', 'success');
        } else {
            await api.createInvoice(data);
            showToast('Invoice generated successfully', 'success');
        }
        closeInvoiceModal();
        loadInvoices();
    } catch (error) {
        showToast(error.message || 'Operation failed', 'error');
    }
}

function editInvoice(id) {
    openInvoiceModal(id);
}

function printInvoice(id) {
    window.open(`/print/invoice/${id}`, '_blank');
}

function viewInvoice(id) {
    window.open(`/print/invoice/${id}`, '_blank');
}

async function deleteInvoice(id) {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
        await api.deleteInvoice(id);
        showToast('Invoice deleted successfully', 'success');
        loadInvoices();
    } catch (error) {
        showToast(error.message || 'Delete failed', 'error');
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

