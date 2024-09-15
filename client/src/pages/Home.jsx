import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatPlaceholder from "../components/ChatPlaceholder";
import ChatWindow from "../components/conversations/ChatWindow"; 
import useFetchMessages from "../hooks/useFetchMessages";

export default function Home() {
  const selectedUser = useSelector((state) => state.users.selectedUser);
  useFetchMessages(selectedUser ? selectedUser._id : null);

  return (
    <main className="flex flex-col sm:flex-row h-screen bg-base-200 pt-[4rem]"> 
      <Sidebar />

      {/* Main chat area */}
      <section className="flex-1 p-4 overflow-auto">
        {selectedUser ? (
          <ChatWindow />
        ) : (
          <ChatPlaceholder />
        )}
      </section>
    </main>
  );
}

