// ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, token } = useSelector((state) => state.auth);

  // If we don't have BOTH a user and a token, they are not fully authenticated
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // If we have a token but no user yet, we might be restoring the session
  // In this case, we return null (or a spinner) to wait for App.jsx's useEffect
  if (!user && token) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
