import Sidebar from "../components/sidebar/Sidebar";
import MessageContainer from "../components/messages/MessageContainer";

export default function Home() {
  return (
    <main className="flex flex-col sm:flex-row h-screen bg-base-200">
      <Sidebar />
      <MessageContainer />
    </main>
  );
}
