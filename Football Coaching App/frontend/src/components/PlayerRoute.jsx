import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * A protected route component that only allows access to users with the 'Player' role.
 * If the user is not logged in, they are redirected to the login page.
 * If the user is logged in but is not a 'Player' (e.g., a 'Coach'), they are redirected to the main dashboard.
 * @param {object} children - The child components to render if the user is authorized.
 */
const PlayerRoute = ({ children }) => {
  // Get authentication state from the Redux store
  const { token, user } = useSelector((state) => state.auth);

  // 1. Check if the user is logged in at all.
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 2. Check if the logged-in user has the 'Player' role.
  if (user && user.role !== 'Player') {
    // If the user is logged in but not a player (e.g., a coach), send them to the dashboard.
    return <Navigate to="/" />;
  }

  // 3. If all checks pass, render the child components.
  return children;
};

export default PlayerRoute;
