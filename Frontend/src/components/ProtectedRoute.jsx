import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserDataContext);
  const location = useLocation();

  if (!user && !localStorage.getItem('token')) {
  
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
           
  // If they are logged in, render the component they wanted to access.
  return children;
};

export default ProtectedRoute;