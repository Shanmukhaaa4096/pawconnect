import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Route guard. Not logged in → /login. Logged in with the wrong role → /dashboard.
 * Omit `roles` to allow any signed-in user.
 */
export const RequireRole: React.FC<{ roles?: UserRole[]; children: React.ReactNode }> = ({ roles, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner label="Checking your session..." />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

/** Login / register pages: signed-in users go straight to their dashboard. */
export const GuestOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner label="Checking your session..." />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};
