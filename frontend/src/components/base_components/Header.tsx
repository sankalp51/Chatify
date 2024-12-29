import AlertModal from "./AlertDialog";
import ThemeToggle from "./ThemeToggle";
import useLogout from "@/hooks/useLogout";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import ContactsList from "./ContactsList";
import { Bell, LogOut } from "lucide-react";
import Dropdown from "./Dropdown";
import ProfileModal from "./ProfileModal";
import { setActiveChat } from "@/redux/features/activeChatSlice";
import { removeNotification } from "@/redux/features/notificationsSlice";

export default function Header() {
  const dispatch = useAppDispatch();
  const logout = useLogout();
  const auth = useAppSelector((state) => state.auth);
  const chats = useAppSelector((state) => state.chats.chats);
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );

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
            <div className="relative">
              <Dropdown
                label="Notifications"
                items={
                  !notifications?.length
                    ? [{ label: "No new messages" }]
                    : notifications.map((notification) => {
                        return {
                          label: notification.chat.isGroupChat
                            ? `New message in ${notification.chat.name}`
                            : `New message from ${notification.sender.firstName}`,
                          onClick: function () {
                            const notificationChat = chats?.find(
                              (chat) => chat._id === notification.chat._id
                            );
                            if (notificationChat) {
                              dispatch(setActiveChat(notificationChat));
                              dispatch(removeNotification(notification._id));
                            }
                          },
                        };
                      })
                }
                icon={<Bell size={20} className="dark:text-white text-black" />}
              />
              {notifications && notifications?.length > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {notifications?.length}
                </span>
              )}
            </div>
            <ProfileModal user={auth.user!} />
          </>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
}
