import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "./useAuth";

export default function useSocket() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth?.user || !auth?.accessToken) return;

    const socket = io(import.meta.env.VITE_API_BASE_URL, {
      query: { userId: auth.id },
    });

    socket.on("getOnlineUsers", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    return () => {
      socket.disconnect();
    };
  }, [auth]);

  return onlineUsers;
}
