import useAxiosPrivate from "./useAxiosPrivate";
import { toast } from "sonner";
import { useState, useEffect } from "react";

// A helper function to add a delay using Promises
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useGetConversation() {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await axiosPrivate.get('/api/users');
                const data = res.data;

                // Delay execution for 4 seconds before setting the data
                await delay(2500);

                setConversations(data);

            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
        getConversations();
    }, [axiosPrivate]);

    return { loading, conversations };
}
