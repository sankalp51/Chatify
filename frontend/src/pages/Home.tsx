import ChatBox from "@/components/base_components/ChatBox";
import MyChats from "@/components/base_components/MyChats";
import { socket } from "../socket";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/store";

export default function Home() {
  const activeuser = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    console.log(socket.connected);
    socket.emit("setup", activeuser);
    
  }, []);
  return (
    <section className="w-full h-full flex justify-center items-center gap-4">
      <MyChats />
      <ChatBox />
    </section>
  );
}
