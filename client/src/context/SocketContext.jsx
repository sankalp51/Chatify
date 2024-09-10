import { createContext, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import io from "socket.io-client";

export const SocketContext = createContext();

export default function SocketContextProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { auth } = useAuth();

    useEffect(() => {
        if (auth?.user) {
            const socket = io(import.meta.env.VITE_API_BASE_URL);
            setSocket(socket);
            return () => socket.close();
        }
        else {
            if (socket) {
                socket.close();
                setSocket(null)
            }
        }
    }, [auth]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}