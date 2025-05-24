import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);

  if (loading) {
    return null;
  }

  return isAuthenticated && user?.role === 'admin' ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

export default AdminRoute; 