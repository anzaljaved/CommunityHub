import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, user } = useAuth();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user data not loaded yet, show loading or wait
  if (!user) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  // Check if user's role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
