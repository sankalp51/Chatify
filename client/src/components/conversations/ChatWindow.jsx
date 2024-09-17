import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import ChatSkeleton from "./ChatSkeleton";
import NoMessages from "./NoMessages";
import { memo } from "react";
import { toast } from "sonner";

const ChatWindow = () => {
  const { auth } = useAuth();
  const userId = auth.id;
  const selectedUser = useSelector((state) => state.users.selectedUser);
  const messages = useSelector((state) => state.messages.messages);
  const status = useSelector((state) => state.messages.status);
  const { emitTyping, typingInfo, onlineUsers, emitSendMessage } = useSocket();
  const [messageInput, setMessageInput] = useState("");

  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    emitSendMessage(selectedUser._id, messageInput, (response) => {
      if (response.status === 201) {
        setMessageInput("");
        emitTypingDebounced(selectedUser._id, false);
      } else {
        toast.error("Failed to send message");
      }
    });
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
  };

  useEffect(() => {
    if (isAtBottom && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  const memoizedMessages = useMemo(
    () =>
      messages.map((msg) => (
        <ChatBubble
          key={msg._id}
          message={msg}
          senderId={msg.sender}
          currentUserId={userId}
          selectedUser={selectedUser}
        />
      )),
    [messages, userId, selectedUser]
  );

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center h-full">
        Select a user to start chatting.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 bg-base-100 rounded-md shadow-md">
      <div className="flex items-center mb-4 space-x-4">
        <div className="avatar">
          <div className="w-12 h-12 rounded-full">
            <img
              src={selectedUser.profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{selectedUser.username}</h2>
          <p className="text-sm text-gray-500">
            {typingInfo.isTyping && typingInfo.senderId === selectedUser._id
              ? "Typing..."
              : onlineUsers.includes(selectedUser._id)
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto mb-4 chat-messages"
        onScroll={handleScroll}
        ref={messagesContainerRef}
      >
        {status === "loading" ? (
          <div>
            {[...Array(3)].map((_, index) => (
              <ChatSkeleton key={index} />
            ))}
          </div>
        ) : status === "failed" ? (
          <NoMessages />
        ) : (
          <div>
            {memoizedMessages}
            <div ref={chatEndRef}></div>
          </div>
        )}
      </div>

      <ChatInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
        emitTyping={emitTyping}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default memo(ChatWindow);
