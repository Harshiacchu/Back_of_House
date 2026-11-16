import { Navigate, Outlet, useLocation } from 'react-router-dom';

import LoadingState from './LoadingState.jsx';
import { useAuth } from '../hooks/useAuth.js';

// Wraps private routes; sends logged-out users to /login and back again afterwards.
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

ProtectedRoute.propTypes = {};
