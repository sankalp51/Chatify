import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/store";

export default function AuthLayout() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const location = useLocation();
  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
}
