export default function User({ user, isOnline, onClick, isSelected }) {
  return (
    <div
      onClick={onClick} 
      className={`flex items-center p-2 hover:bg-primary hover:text-white rounded cursor-pointer ${
        isSelected ? "bg-primary text-white" : ""
      }`}
    >
      <div className={`avatar ${isOnline && "online"}`}>
        <div className="w-12 rounded-full">
          <img src={user.profilePic} alt={user.username} />
        </div>
      </div>
      <div className="ml-4">
        <p className="text-md font-medium">{user.username}</p>
      </div>
    </div>
  );
}
