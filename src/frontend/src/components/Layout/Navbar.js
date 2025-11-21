import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <i className="fas fa-wrench"></i>
          Service Center
        </Link>
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            <i className="fas fa-home"></i>
            Dashboard
          </Link>
          <Link to="/customers" className="nav-link">
            <i className="fas fa-users"></i>
            Customers
          </Link>
          <Link to="/vehicles" className="nav-link">
            <i className="fas fa-car"></i>
            Vehicles
          </Link>
          <Link to="/service-requests" className="nav-link">
            <i className="fas fa-clipboard-list"></i>
            Service Requests
          </Link>
          <Link to="/services" className="nav-link">
            <i className="fas fa-tools"></i>
            Services
          </Link>
          <Link to="/service-templates" className="nav-link">
            <i className="fas fa-list-alt"></i>
            Service Templates
          </Link>
          <Link to="/invoices" className="nav-link">
            <i className="fas fa-file-invoice"></i>
            Invoices
          </Link>
          {user && (
            <div className="user-info">
              <i className="fas fa-user-circle"></i>
              <span className="username">{user.username}</span>
              <span className="role">{user.role}</span>
              <button onClick={handleLogout} className="btn-logout">
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

