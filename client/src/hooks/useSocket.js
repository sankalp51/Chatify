import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import useAuth from "./useAuth";

export default function useSocket() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingInfo, setTypingInfo] = useState({ isTyping: false, senderId: null }); // To track typing status
  const { auth } = useAuth();
  const socketRef = useRef(null); // Use useRef to store the socket instance

  useEffect(() => {
    if (!auth?.user || !auth?.accessToken) return;

    // Initialize socket connection and store it in socketRef
    socketRef.current = io(import.meta.env.VITE_API_BASE_URL, {
      query: { userId: auth.id },
    });

    // Listen for events
    socketRef.current.on("getOnlineUsers", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    // Listen for typing events
    socketRef.current.on("typing", ({ senderId, isTyping }) => {
      setTypingInfo({ isTyping, senderId });
    });

    // Clean up socket connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [auth]);

  // Emit typing event
  const emitTyping = (recipientId, isTyping) => {
    if (socketRef.current) {
      socketRef.current.emit("typing", { recipientId, isTyping });
    }
  };

  return { onlineUsers, typingInfo, emitTyping };
}
