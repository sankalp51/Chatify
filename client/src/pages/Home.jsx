import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatPlaceholder from "../components/ChatPlaceholder";
import ChatWindow from "../components/conversations/ChatWindow";
import useFetchMessages from "../hooks/useFetchMessages";
import { useContext, useEffect } from "react";
import SidebarContext from "../context/SideBarContext";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const selectedUser = useSelector((state) => state.users.selectedUser);
  useFetchMessages(selectedUser ? selectedUser._id : null);

  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

  useEffect(() => {
    if (!auth) {
      navigate("/login", { replace: true });
    }
  }, [auth]);

  return (
    <main className="flex flex-col sm:flex-row h-screen bg-base-200 pt-[4rem] relative">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:relative sm:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <Sidebar toggleSidebar={toggleSidebar} />
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main chat area */}
      <section className="flex-1 p-4 overflow-auto relative z-0">
        {selectedUser ? <ChatWindow /> : <ChatPlaceholder />}
      </section>
    </main>
  );
}
