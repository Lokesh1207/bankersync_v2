import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken'); // Get JWT token 
  return token ? <Outlet /> : <Navigate to="/login" />; // Redirect to login if no token
};

export default ProtectedRoute;
