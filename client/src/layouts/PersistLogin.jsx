import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { useEffect, useState } from "react";


export default function PersistLogin() {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false)
            }
        }
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, [refresh, auth]);

    return (
        <>
            {isLoading ? <p>Loading...</p> : <Outlet />}
        </>
    )
}
