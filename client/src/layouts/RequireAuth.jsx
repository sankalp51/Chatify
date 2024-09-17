// RequireAuth.jsx
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function RequireAuth() {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth?.accessToken) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}
