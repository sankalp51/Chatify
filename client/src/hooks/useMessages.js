import useSocket from "./useSocket"
import useConversation from "../zustand/useConversation";
import { useEffect } from "react";

export default function useMessage() {
    const { socket } = useSocket();
    const { messages, setMessages } = useConversation();
    useEffect(() => {
        socket?.on("newMessage", newMessage => {
            setMessages([...messages, newMessage])
        });
        return () => socket?.off("newMessage");
    }, [])
}