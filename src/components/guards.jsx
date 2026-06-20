import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppProviders.jsx';

// Requires a signed-in account.
export function RequireAuth({ children }) {
  const { user } = useApp();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

// Requires both auth and an active profile (sends to profile picker otherwise).
export function RequireProfile({ children }) {
  const { user, activeProfile } = useApp();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!activeProfile) return <Navigate to="/profiles" replace state={{ from: location }} />;
  return children;
}
