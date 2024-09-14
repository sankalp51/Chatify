import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from "./useAxiosPrivate";
import { setMessages, setStatus, clearMessages } from "../redux/features/messageSlice";
import { toast } from "sonner";

export default function useFetchMessages(userId) {
  const axios = useAxiosPrivate();
  const dispatch = useDispatch();

  // Get the messages and status from Redux
  const messages = useSelector((state) => state.messages.messages);
  const status = useSelector((state) => state.messages.status);

  useEffect(() => {
    if (!userId) {
      dispatch(clearMessages());
      return;
    }

    const fetchMessages = async () => {
      dispatch(setStatus("loading"));
      try {
        const response = await axios.get(`/api/messages/${userId}`);
        dispatch(setMessages(response.data));
      } catch (error) {
        toast.error("Failed to fetch messages");
        dispatch(setStatus("failed"));
      }
    };

    fetchMessages();
  }, [userId, axios, dispatch]);

  return { messages, status };
}
