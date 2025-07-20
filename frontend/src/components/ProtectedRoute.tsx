import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks';

const ProtectedRoute = () => {
  const authState = useAppSelector((state) => state.auth);
  if (!authState || authState.loading) return null;
  return authState.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
