export default function User({ user, isOnline }) {
  return (
    <li className="flex items-center p-2 hover:bg-base-200 rounded cursor-pointer">
      <div className={`avatar ${isOnline ? "online" : "offline"}`}>
        <div className="w-12 rounded-full">
          <img src={user.profilePic} alt={user.username} />
        </div>
      </div>
      <div className="ml-4">
        <p className="text-md font-medium">{user.username}</p>
      </div>
    </li>
  );
}
