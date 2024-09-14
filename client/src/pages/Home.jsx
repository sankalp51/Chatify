import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatPlaceholder from "../components/ChatPlaceholder";
import ChatWindow from "../components/conversations/ChatWindow"; // Import ChatWindow
import useFetchMessages from "../hooks/useFetchMessages";

export default function Home() {
  const selectedUser = useSelector((state) => state.users.selectedUser); // Get selected user from Redux
  useFetchMessages(selectedUser ? selectedUser._id : null); // Fetch messages when selectedUser changes

  return (
    <main className="flex flex-col sm:flex-row h-screen bg-base-200">
      <Sidebar />

      {/* Main chat area */}
      <section className="flex-1 p-4">
        {selectedUser ? (
          <ChatWindow /> // No need to pass selectedUser as a prop
        ) : (
          <ChatPlaceholder />
        )}
      </section>
    </main>
  );
}
