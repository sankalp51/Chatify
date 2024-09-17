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

    // Listen for online users
    socketRef.current.on("getOnlineUsers", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    // Listen for typing events
    socketRef.current.on("typing", ({ senderId, isTyping }) => {
      setTypingInfo({ isTyping, senderId });
    });

    // Listen for new messages
    socketRef.current.on("newMessage", (message) => {
      dispatch(addMessage(message)); 
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [auth, dispatch]);

  // Emit typing event
  const emitTyping = (recipientId, isTyping) => {
    if (socketRef.current) {
      socketRef.current.emit("typing", { recipientId, isTyping });
    }
  };

  // Emit sendMessage event
  const emitSendMessage = (recipientId, message, callback) => {
    if (socketRef.current) {
      socketRef.current.emit(
        "sendMessage", 
        { recipientId, message, username: auth.user }, 
        (response) => {
          if (response.status === 201) {
            dispatch(addMessage(response.message)); 
          } else {
            console.error("Failed to send message:", response.error);
          }
          if (callback) callback(response);
        }
      );
    }
  };

  return { onlineUsers, typingInfo, emitTyping, emitSendMessage };
}
