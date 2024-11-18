import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useRefresh from "@/hooks/useRefresh";
import { useAppSelector } from "@/redux/store";
import Spinner from "@/components/base_components/Spinner";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefresh();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return <>{isLoading ? <Spinner /> : <Outlet />}</>;
}
