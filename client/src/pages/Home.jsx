import Sidebar from "../components/Sidebar/Sidebar";
import ChatPlaceholder from "../components/ChatPlaceholder";

export default function Home() {
  return (
    <main className="flex flex-col sm:flex-row h-screen bg-base-200">
      <Sidebar />
      <section className="flex-1 p-4">
        <ChatPlaceholder />
      </section>
    </main>
  );
}
