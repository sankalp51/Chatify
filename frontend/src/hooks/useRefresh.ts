import { api } from "@/utils/axios";
import { useAppDispatch } from "@/redux/store";
import { setLogIn, setLogout } from "@/redux/features/authSlics";

export default function useRefresh() {
  const dispatch = useAppDispatch();
  const refresh = async () => {
    try {
      const response = await api.get<AuthPayload>("/api/auth/refresh", {
        withCredentials: true,
      });
      dispatch(setLogIn(response.data));
      return response.data;
    } catch (error) {
      dispatch(setLogout());
    }
  };
  return refresh;
}
