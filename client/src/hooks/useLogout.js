import axios from "../api/axios";
import useAuth from "./useAuth";

export default function useLogout() {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth(prevState => {
            return {
                ...prevState,
                accessToken: ""
            }
        });
        try {
            await axios.get("/api/auth/logout", { withCredentials: true });
        } catch (error) {
            console.log(error);
        }
    }
    return logout;
}
