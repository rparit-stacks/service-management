import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Memoize to prevent unnecessary re-renders
  const content = useMemo(() => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }, [loading, user, children]);

  return content;
};

export default ProtectedRoute;

