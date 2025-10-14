import React from 'react';
import { useAuth } from '../AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!currentUser) {
    // Rediriger vers la page de connexion avec l'URL actuelle comme destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;