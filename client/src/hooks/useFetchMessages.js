import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import { toast } from "sonner";

export default function useFetchMessages(userId) {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'succeeded' | 'failed'
  const axios = useAxiosPrivate();

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      setStatus("loading");
      try {
        const response = await axios.get(`api/messages/${userId}`);
        setMessages(response.data);
        setStatus("succeeded");
      } catch (error) {
        toast.error("Failed to fetch messages");
        setStatus("failed");
      }
    };

    fetchMessages();
  }, [userId]);

  return { messages, status };
}
