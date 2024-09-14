import format from "date-fns/format";

export default function ChatBubble({
  message,
  senderId,
  currentUserId,
  selectedUser,
}) {
  return (
    <div
      className={`chat ${
        message.sender === currentUserId ? "chat-end" : "chat-start"
      }`}
    >
      <div className="chat-header">
        {message.sender === currentUserId ? "You" : selectedUser.username}
        <time className="text-xs opacity-50 ml-2">
          {format(new Date(message.createdAt), "p, MMM d")}
        </time>
      </div>
      <div className="chat-bubble">{message.message}</div>
      <div className="chat-footer opacity-50">
        {message.status || "Delivered"}
      </div>
    </div>
  );
}
