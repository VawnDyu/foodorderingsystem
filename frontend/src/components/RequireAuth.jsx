// components/RequireAuth.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTokenValidation } from '../hooks/useTokenValidation';
import '../styles/globals.css';

const RequireAuth = ({ children }) => {
  const { isValid, isChecking } = useTokenValidation();

  if (isChecking) {
    return  <div className='spinnerContainer'>
              <div className='spinner'></div>
            </div>; // or a proper loader
  }

  return isValid ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
