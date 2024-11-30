import { useAppSelector } from "@/redux/store";
import SingleChat from "./SingleChat";

export default function ChatBox() {
  const activeChat = useAppSelector((state) => state.activeChat.activeChat);

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
