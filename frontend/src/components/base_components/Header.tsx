import AlertModal from "./AlertDialog";
import ThemeToggle from "./ThemeToggle";
import useLogout from "@/hooks/useLogout";
import { useAppSelector } from "@/redux/store";
import ContactsList from "./ContactsList";
import { Bell, LogOut } from "lucide-react";
import Modal from "./Modal";
import Avtar from "./Avtar";
import Dropdown from "./Dropdown";

export default function Header() {
  const logout = useLogout();
  const auth = useAppSelector((state) => state.auth);

  return (
    <header className="w-full flex justify-between items-center p-8 bg-muted">
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
            <Modal
              description="information about your profile"
              title="Profile Information"
              trigger={
                <Avtar
                  name={`${auth.user?.firstName} ${auth.user?.lastName}`}
                />
              }
            >
              <figure>
                <img src={auth.user?.profilePic.url} />
                <figcaption>
                  <h2>{`${auth.user?.firstName} ${auth.user?.lastName}`}</h2>
                  <p>{auth.user?.email}</p>
                </figcaption>
              </figure>
            </Modal>
          </>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
}
