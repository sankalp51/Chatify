import format from "date-fns/format";
import classNames from "classnames";
import { memo } from "react";

const ChatBubble = ({ message, senderId, currentUserId, selectedUser }) => {
  const isCurrentUser = message.sender === currentUserId;

  return (
    <div
      className={classNames("chat", {
        "chat-end": isCurrentUser,
        "chat-start": !isCurrentUser,
      })}
    >
      <div
        className={classNames("chat-bubble", {
          "chat-bubble-primary text-white": !isCurrentUser,
        })}
      >
        {message.message}
      </div>
      <div className="chat-footer">
        <time className="text-xs ml-2 opacity-70">
          {format(new Date(message.createdAt), "p, MMM d")}
        </time>
      </div>
    </div>
  );
};

export default memo(ChatBubble);
