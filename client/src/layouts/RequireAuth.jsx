import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function RequireAuth() {
    const { auth } = useAuth();
    const location = useLocation();
    return (
        auth?.accessToken ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />
    )
}
