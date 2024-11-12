import Header from "@/components/base_components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-secondary text-foreground p-8">
      <Header />
        <Outlet />
    </main>
  );
}
