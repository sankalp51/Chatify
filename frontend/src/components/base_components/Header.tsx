import Modal from "./Modal";
import ThemeToggle from "./ThemeToggle";
import useLogout from "@/hooks/useLogout";
import { useAppSelector } from "@/redux/store";

export default function Header() {
  const logout = useLogout();
  const auth = useAppSelector((state) => state.auth.accessToken);
  return (
    <header className="w-full flex justify-between items-center">
      <h1 className="text-2xl font-bold">Chatify</h1>
      <div className="flex justify-center items-center flex-wrap gap-4">
        {auth && (
          <Modal
            trigger="logout"
            title="Logout"
            description="Are you sure you want to logout?"
            triggerClasses="bg-destructive px-4 py-2 rounded-sm text-white"
            actionClasses="bg-destructive hover:bg-red-600 dark:text-white border-none"
            actionFunction={async () => await logout()}
          />
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
