import axios from "../api/axios";
import useAuth from "./useAuth";

export default function useLogout() {
  const { setAuth } = useAuth();

  const logout = async () => {
    try {
      await axios.get("/api/auth/logout", { withCredentials: true });
      setAuth(null);
    } catch (error) {
      console.log(error);
    }
  };
  return logout;
}
