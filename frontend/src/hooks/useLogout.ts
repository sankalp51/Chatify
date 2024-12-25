import { useAppDispatch } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { setLogout } from "@/redux/features/authSlics";
import { api } from "@/utils/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { socket } from "../socket";

export default function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.get("/api/auth/logout", {
        withCredentials: true,
      });
      toast.success("Successfully logged out");
      dispatch(setLogout());
      socket.disconnect();
      navigate("/auth");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  };
  return logout;
}
