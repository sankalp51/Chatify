import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { addMessage } from "../../redux/features/messageSlice";
import debounce from "lodash.debounce";
import ChatBubble from "./ChatBubble"; // Import ChatBubble component
import ChatInput from "./ChatInput"; // Import ChatInput component

export default function ChatWindow() {
  const { auth } = useAuth();
  const axios = useAxiosPrivate();
  const userId = auth.id;
  const selectedUser = useSelector((state) => state.users.selectedUser);
  const messages = useSelector((state) => state.messages.messages);
  const status = useSelector((state) => state.messages.status);
  const { emitTyping, typingInfo } = useSocket();
  const [messageInput, setMessageInput] = useState("");
  const dispatch = useDispatch();
  const chatEndRef = useRef(null); // Ref for auto-scrolling

  // Debounce the typing event to limit socket emission frequency
  const emitTypingDebounced = debounce((recipientId, isTyping) => {
    emitTyping(recipientId, isTyping);
  }, 300);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (messageInput.trim() === "") return;

    try {
      const response = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        {
          message: messageInput,
        }
      );

      // Dispatch the new message to Redux
      dispatch(addMessage(response.data));

      // Clear the input field and emit the typing event
      setMessageInput("");
      emitTyping(selectedUser._id, false);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  // Scroll to the latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full p-4 bg-base-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        Chat with {selectedUser.username}
      </h2>

      {/* Show loading and error states */}
      {status === "loading" && <p>Loading messages...</p>}
      {status === "failed" && <p>Failed to load messages.</p>}

      {/* Message container */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            message={msg}
            senderId={msg.sender}
            currentUserId={userId}
            selectedUser={selectedUser}
          />
        ))}
        <div ref={chatEndRef}></div> {/* Ref for auto-scrolling */}
        {/* Typing Indicator */}
        {typingInfo.isTyping && typingInfo.senderId === selectedUser._id && (
          <div className="text-sm italic text-gray-500 mt-2">
            {selectedUser.username} is typing...
          </div>
        )}
      </div>

      {/* Input for sending new messages */}
      <ChatInput
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
        emitTyping={emitTypingDebounced}
        selectedUser={selectedUser}
      />
    </div>
  );
}
