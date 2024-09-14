import { useDispatch, useSelector } from "react-redux";
import User from "./User";
import useAuth from "../../hooks/useAuth";
import useGetUsers from "../../hooks/useGetUsers";
import useSocket from "../../hooks/useSocket";
import { selectUser } from "../../redux/features/usersSlice";

export default function Sidebar() {
  const { auth } = useAuth();
  const userId = auth.id;
  useGetUsers(); // Fetch users using the custom hook (will dispatch users to Redux)
  const onlineUsers = useSocket(userId);

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users); // Get users from Redux
  const selectedUser = useSelector((state) => state.users.selectedUser); // Get the selected user from Redux

  // Handle user selection
  const handleUserClick = (user) => {
    dispatch(selectUser(user)); // Update the selected user in Redux
  };

  return (
    <aside className="w-full sm:w-1/4 bg-base-100 p-4 border-r border-base-300 overflow-y-auto">
      {!users.length && (
        <h2 className="text-lg font-semibold mb-4">No chats available ☹️</h2>
      )}
      <ul className="space-y-2">
        {users.map((user) => (
          <User
            key={user._id}
            user={user}
            isOnline={onlineUsers.includes(user._id)}
            onClick={() => handleUserClick(user)} // Pass the click handler
            isSelected={selectedUser && selectedUser._id === user._id} // Pass selected state
          />
        ))}
      </ul>
    </aside>
  );
}
