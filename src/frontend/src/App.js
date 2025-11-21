import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Customers from './components/Customers/Customers';
import Vehicles from './components/Vehicles/Vehicles';
import Services from './components/Services/Services';
import ServiceRequests from './components/ServiceRequests/ServiceRequests';
import ServiceTemplates from './components/ServiceTemplates/ServiceTemplates';
import Invoices from './components/Invoices/Invoices';
import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <Sidebar onToggle={setSidebarCollapsed} />
                    <div className="main-content-wrapper">
                      <Header />
                      <div className="main-content">
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/customers" element={<Customers />} />
                          <Route path="/vehicles" element={<Vehicles />} />
                          <Route path="/service-requests" element={<ServiceRequests />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/service-templates" element={<ServiceTemplates />} />
                          <Route path="/invoices" element={<Invoices />} />
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

