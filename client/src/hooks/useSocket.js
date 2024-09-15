import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux"; 
import { addMessage } from "../redux/features/messageSlice";
import useAuth from "./useAuth";

export default function useSocket() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingInfo, setTypingInfo] = useState({ isTyping: false, senderId: null }); 
  const { auth } = useAuth();
  const socketRef = useRef(null);
  const dispatch = useDispatch(); 

  useEffect(() => {
    if (!auth?.user || !auth?.accessToken) return;


    socketRef.current = io(import.meta.env.VITE_API_BASE_URL, {
      query: { userId: auth.id },
    });

  
    socketRef.current.on("getOnlineUsers", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });


    socketRef.current.on("typing", ({ senderId, isTyping }) => {
      setTypingInfo({ isTyping, senderId });
    });


    socketRef.current.on("newMessage", (message) => {
      dispatch(addMessage(message)); 
    });


    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [auth, dispatch]);

  const emitTyping = (recipientId, isTyping) => {
    if (socketRef.current) {
      socketRef.current.emit("typing", { recipientId, isTyping });
    }
  };

  return { onlineUsers, typingInfo, emitTyping };
}
