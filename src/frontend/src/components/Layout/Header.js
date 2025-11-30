import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h2 className="page-title">
            <i className="fas fa-wrench"></i>
            Service Center Management
          </h2>
        </div>
        <div className="header-right">
          {user && (
            <div className="header-user-info">
              <div className="user-avatar-header">
                <i className="fas fa-user"></i>
              </div>
              <div className="user-details-header">
                <span className="username-header">{user.username}</span>
                <span className="role-header">{user.role}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout-header" title="Logout">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;




