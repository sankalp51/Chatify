import { useDispatch, useSelector } from "react-redux";
import User from "./User";
import useAuth from "../../hooks/useAuth";
import useGetUsers from "../../hooks/useGetUsers";
import useSocket from "../../hooks/useSocket";
import { selectUser } from "../../redux/features/usersSlice";
import { useContext } from "react";
import SidebarContext from "../../context/SideBarContext";
import { FiX } from "react-icons/fi";

export default function Sidebar() {
  const { auth } = useAuth();
  const userId = auth.id;
  useGetUsers();
  const { onlineUsers } = useSocket(userId);
  const { toggleSidebar } = useContext(SidebarContext);

  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const selectedUser = useSelector((state) => state.users.selectedUser);
  const loading = useSelector((state) => state.users.loading);

  const handleUserClick = (user) => {
    dispatch(selectUser(user));
    if (window.innerWidth < 640) {
      toggleSidebar(); 
    }
  };

  return (
    <aside className="h-full bg-base-100 p-4 border-r border-base-300 overflow-y-auto">
      <div className="sm:hidden flex justify-end mb-4">
        <button onClick={toggleSidebar} className="p-2">
          <FiX size={24} />
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : !users.length ? (
        <h2 className="text-lg font-semibold mb-4">No chats available ☹️</h2>
      ) : (
        <ul className="space-y-2 p-2">
          {users.map((user) => (
            <User
              key={user._id}
              user={user}
              isOnline={onlineUsers.includes(user._id)}
              onClick={() => handleUserClick(user)}
              isSelected={selectedUser && selectedUser._id === user._id}
            />
          ))}
        </ul>
      )}
    </aside>
  );
}
