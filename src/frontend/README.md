# Service Center Frontend

React.js frontend application for the Service Center Management System.

## Features

- User Authentication (Register/Login with auto-login)
- Dashboard with statistics
- Customer Management
- Vehicle Management
- Service Request Management
- Service/Job Management
- Invoice Creation with Payment (Cash only)
- Invoice Download and Print

## Setup Instructions

1. Navigate to the frontend directory:
```bash
cd src/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Backend Configuration

Make sure the Spring Boot backend is running on `http://localhost:8080`

The frontend is configured to communicate with the backend API at `http://localhost:8080/api`

## Authentication Flow

1. User can register a new account (Employee/Admin)
2. If user already exists, they can login
3. After successful registration/login, user is automatically redirected to dashboard
4. Session-based authentication is used (cookies)

## Project Structure

```
src/
  components/
    Auth/          # Login and Register components
    Dashboard/     # Dashboard component
    Customers/     # Customer management
    Vehicles/      # Vehicle management
    ServiceRequests/ # Service request management
    Services/      # Service/Job management
    Invoices/      # Invoice management
    Layout/        # Navbar component
  context/         # Auth context for state management
  services/        # API service layer
  App.js           # Main app component with routing
  index.js         # Entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

