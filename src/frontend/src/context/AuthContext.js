import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasCheckedAuth = useRef(false);
  const isCheckingAuth = useRef(false);

  useEffect(() => {
    // Only check auth once on mount
    if (hasCheckedAuth.current || isCheckingAuth.current) {
      return;
    }

    // Check localStorage first for immediate UI
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setLoading(false);
        // Verify with server in background (don't block UI)
        verifyAuthWithServer();
        return;
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    // If no saved user, check with server
    verifyAuthWithServer();
  }, []);

  const verifyAuthWithServer = async () => {
    if (hasCheckedAuth.current || isCheckingAuth.current) {
      return;
    }
    
    isCheckingAuth.current = true;
    hasCheckedAuth.current = true;

    try {
      const response = await authAPI.getCurrentUser();
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      // 403 or 401 means user is not authenticated - this is expected
      setUser(null);
      localStorage.removeItem('user');
      // Don't log error for 403/401 as it's expected when not logged in
      if (error.response?.status !== 403 && error.response?.status !== 401) {
        console.error('Auth check error:', error);
      }
    } finally {
      setLoading(false);
      isCheckingAuth.current = false;
    }
  };

  const checkAuth = async () => {
    // Only allow manual check if not already checking
    if (isCheckingAuth.current) {
      return;
    }
    await verifyAuthWithServer();
  };

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return { success: true, data: response.data };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      // Force clear any cached data
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

