import User from "./User";
import useAuth from "../../hooks/useAuth";
import useGetUsers from "../../hooks/useGetUsers";
import useSocket from "../../hooks/useSocket";

export default function Sidebar() {
  const { auth } = useAuth();
  const userId = auth.id;
  const users = useGetUsers();
  const onlineUsers = useSocket(userId);
  return (
    <aside className="w-full sm:w-1/4 bg-base-100 p-4 border-r border-base-300 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Available Users</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <User
            key={user._id}
            user={user}
            isOnline={onlineUsers.includes(user._id)}
          />
        ))}
      </ul>
    </aside>
  );
}
