import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useConversation from "../zustand/useConversation";
import { toast } from 'sonner';


export default function useGetMessage() {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const axiosPrivate = useAxiosPrivate();
    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const res = await axiosPrivate.get(`/api/messages/${selectedConversation._id}`);
                // Small delay to show skeleton
                await new Promise(resolve => setTimeout(resolve, 2500));
                setMessages(res.data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id]);

    return { loading, messages }
}