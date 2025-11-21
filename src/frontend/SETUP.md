# Service Center Frontend - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd src/frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080 (must be running)

## Application Flow

### 1. Authentication
- **Register**: Create a new account (Employee/Admin role)
- **Login**: If account exists, login with username/password
- **Auto-login**: After registration, user is automatically logged in and redirected to dashboard

### 2. Customer Management
- Create customers with full name, email, and phone
- View all customers
- Edit/Delete customers

### 3. Vehicle Management
- Create vehicles linked to customers (via Foreign Key)
- When selecting a customer, their vehicles are automatically associated
- View all vehicles with customer information

### 4. Service Request Management
- Create service requests for vehicles
- Service requests link vehicles to jobs/services
- Track status: PENDING, IN_PROGRESS, COMPLETED, CANCELLED

### 5. Service/Job Management
- Create services/jobs (e.g., Washing, Clutch Change)
- Link services to service requests
- Set cost for each service/job

### 6. Invoice Creation
- Select a service request (which includes customer and vehicle automatically via FK)
- View all services/jobs associated with the service request
- Add tax and discount percentages
- Set payment status (Cash only - PAID/UNPAID)
- Calculate total automatically
- Create invoice

### 7. Invoice Download/Print
- Download invoice as PDF (opens in new tab)
- Print invoice directly

## Features

- ✅ Session-based authentication with cookies
- ✅ CORS properly configured for React (port 3000)
- ✅ Auto-login after registration
- ✅ Protected routes (require authentication)
- ✅ Responsive UI with modern design
- ✅ Real-time data updates
- ✅ Form validation
- ✅ Error handling

## API Endpoints Used

- `/api/auth/*` - Authentication
- `/api/customers/*` - Customer management
- `/api/vehicles/*` - Vehicle management
- `/api/service-requests/*` - Service request management
- `/api/services/*` - Service/Job management
- `/api/invoices/*` - Invoice management
- `/print/invoice/{id}` - Invoice print/download

## Important Notes

1. **Backend must be running** on port 8080
2. **CORS is configured** to allow requests from localhost:3000
3. **Authentication uses sessions** (cookies) - no JWT tokens
4. **Payment method is Cash only** as per requirements
5. **Vehicles are automatically linked** to customers via Foreign Key relationship

## Troubleshooting

### CORS Errors
- Ensure backend CORS config includes `http://localhost:3000`
- Check that `withCredentials: true` is set in API calls

### Authentication Issues
- Clear browser cookies if session issues occur
- Check backend session timeout settings

### API Connection Errors
- Verify backend is running on port 8080
- Check network tab in browser DevTools for API errors

