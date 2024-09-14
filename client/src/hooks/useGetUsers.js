import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const axios = useAxiosPrivate();

  useEffect(() => {
    // Fetch available users
    axios
      .get("/api/users") // Adjust the URL as necessary
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return users;
};

export default useFetchUsers;
