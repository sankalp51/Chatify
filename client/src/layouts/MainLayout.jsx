import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useState } from "react";
import SidebarContext from "../context/SideBarContext.jsx";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <Header />
      <Outlet />
    </SidebarContext.Provider>
  );
}
