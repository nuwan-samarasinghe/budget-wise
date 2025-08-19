import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { checkAuth } from '../feature/auth/authSlice';
import { useAppSelector } from '../hooks';
import type { AppDispatch } from '../store';

const ProtectedRoute = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const authState = useAppSelector((state) => state.auth);

  if (!authState || authState.loading) return null;

  return authState.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
