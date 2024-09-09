import { useState } from "react";
import useConversation from "../zustand/useConversation";
import useAxiosPrivate from "./useAxiosPrivate";
import { toast } from "sonner";

export default function useSendMessage() {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const axiosPrivate = useAxiosPrivate();
    const sendMessage = async (message) => {
        setLoading(true);
        try {
            const res = await axiosPrivate.post(`/api/messages/send/${selectedConversation._id}`,
                { message },
                {
                    headers: { 'Content-Type': 'application/json' }
                });
            setMessages([...messages, res.data]);
        } catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }
    return [loading, sendMessage];
}