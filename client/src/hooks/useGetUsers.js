import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUsers } from "../redux/features/usersSlice";
import useAxiosPrivate from "./useAxiosPrivate";
import { toast } from "sonner";

export default function useGetUsers() {
  const axios = useAxiosPrivate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch available users
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        dispatch(setUsers(response.data));
      } catch (error) {
        toast.error("Error fetching users");
      }
    };

    fetchUsers();
  }, [axios, dispatch]);
}
