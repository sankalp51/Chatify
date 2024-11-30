import AlertModal from "./AlertDialog";
import ThemeToggle from "./ThemeToggle";
import useLogout from "@/hooks/useLogout";
import { useAppSelector } from "@/redux/store";
import ContactsList from "./ContactsList";
import { Bell, LogOut } from "lucide-react";
import Dropdown from "./Dropdown";
import ProfileModal from "./ProfileModal";

export default function Header() {
  const logout = useLogout();
  const auth = useAppSelector((state) => state.auth);

  return (
    <header className="w-full flex justify-between items-center p-4 bg-muted">
      {auth.accessToken && <ContactsList />}
      <h1 className="text-3xl font-bold md:text-2xl">Chatify</h1>
      <div className="flex justify-center items-center flex-wrap gap-4">
        {auth.accessToken && (
          <>
            <AlertModal
              trigger={<LogOut size={20} className="text-destructive" />}
              title="Logout"
              description="Are you sure you want to logout?"
              triggerClasses="bg-muted text-white p-2 rounded-full"
              actionClasses="bg-destructive hover:bg-red-600 dark:text-white border-none"
              actionFunction={async () => await logout()}
            />
            <Dropdown
              label="Notifications"
              items={[
                {
                  label: "notification1",
                  onClick: function () {
                    console.log("something");
                  },
                },
              ]}
              icon={<Bell size={20} className="dark:text-white text-black" />}
            />
            <ProfileModal user={auth.user!} />
          </>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
}
