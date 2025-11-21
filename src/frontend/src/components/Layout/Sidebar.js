import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { path: '/customers', icon: 'fa-users', label: 'Customers' },
    { path: '/vehicles', icon: 'fa-car', label: 'Vehicles' },
    { path: '/service-requests', icon: 'fa-clipboard-list', label: 'Service Requests' },
    { path: '/services', icon: 'fa-tools', label: 'Services' },
    { path: '/service-templates', icon: 'fa-list-alt', label: 'Service Templates' },
    { path: '/invoices', icon: 'fa-file-invoice', label: 'Invoices' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <i className="fas fa-wrench"></i>
          {!isCollapsed && <span>Service Center</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={handleToggle}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          <i className={`fas fa-${isCollapsed ? 'angle-right' : 'angle-left'}`}></i>
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <i className={`fas ${item.icon}`}></i>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="sidebar-footer">
          {!isCollapsed && (
            <div className="user-info-sidebar">
              <i className="fas fa-user-circle"></i>
              <div className="user-details-sidebar">
                <span className="username">{user.username}</span>
                <span className="role">{user.role}</span>
              </div>
            </div>
          )}
          <button 
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="sidebar-logout-btn"
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

