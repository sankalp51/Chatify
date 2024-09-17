import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

export default function PersistLogin() {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(!auth?.accessToken);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!auth?.accessToken) {
      verifyRefreshToken();
    }
  }, [refresh, auth?.accessToken]);

  return <>{isLoading ? <Loading /> : <Outlet />}</>;
}
