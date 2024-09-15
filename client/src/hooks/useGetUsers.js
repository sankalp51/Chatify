import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUsers, setLoading } from "../redux/features/usersSlice";
import useAxiosPrivate from "./useAxiosPrivate";
import { toast } from "sonner";

export default function useGetUsers() {
  const axios = useAxiosPrivate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch(setLoading(true)); 

      try {
        const response = await axios.get("/api/users");

        setTimeout(() => {
          dispatch(setUsers(response.data));
        }, 1000);
      } catch (error) {
        dispatch(setLoading(false));
        toast.error("Error fetching users");
      }
    };

    fetchUsers();
  }, [axios, dispatch]);
}
