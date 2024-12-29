import { useAppSelector } from "@/redux/store";
import SingleChat from "./SingleChat";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store";
import { addNotification } from "@/redux/features/notificationsSlice";
import { socket } from "../../socket";

export default function ChatBox() {
  const dispatch = useAppDispatch();
  const activeChat = useAppSelector((state) => state.activeChat.activeChat);

  useEffect(() => {
    socket.on("message received", (message: Message) => {
      if (!activeChat || activeChat?._id !== message.chat._id) {
        dispatch(addNotification(message));
      }
    });

    return () => {
      socket.off("message received");
    };
  },[activeChat]);

  return (
    <div
      className={`${
        activeChat ? "flex" : "hidden"
      } md:flex items-center flex-col bg-muted w-full md:w-[68%] rounded-lg h-[calc(100vh-90px)] mt-2`}
    >
      <SingleChat />
    </div>
  );
}
