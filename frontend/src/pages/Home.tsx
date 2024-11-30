import ChatBox from "@/components/base_components/ChatBox";
import MyChats from "@/components/base_components/MyChats";

export default function Home() {
  return (
    <section className="w-full h-full flex justify-center items-center gap-4">
      <MyChats />
      <ChatBox />
    </section>
  );
}
