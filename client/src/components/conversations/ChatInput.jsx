import { useState, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import useTheme from "../../hooks/useTheme";

export default function ChatInput({
  messageInput,
  setMessageInput,
  handleSendMessage,
  emitTyping,
  selectedUser,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const theme = useTheme();
  const typingRef = useRef(null);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    emitTyping(selectedUser._id, true);

    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }

    typingRef.current = setTimeout(() => {
      emitTyping(selectedUser._id, false);
    }, 500);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessageInput((prevInput) => prevInput + emojiObject.emoji);
  };

  const handleSendMessageWrapper = () => {
    emitTyping(selectedUser._id, false);
    setShowEmojiPicker(false);
    handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessageWrapper();
    }
  };

  const sendMessage = () => {
    setShowEmojiPicker(false);
    handleSendMessage();
  };

  return (
    <div className="mt-4 flex items-center space-x-2 relative">
      <button
        onClick={toggleEmojiPicker}
        className="p-3 rounded-full bg-transparent hover:bg-primary hover:text-white flex items-center justify-center"
      >
        <MdOutlineEmojiEmotions size={24} />
      </button>

      <div
        className={`absolute bottom-14 left-0 transition-all duration-200 ease-in-out transform ${
          showEmojiPicker
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          emojiStyle="native"
          theme={theme}
          lazyLoadEmojis
        />
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        value={messageInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        onClick={sendMessage}
        className="p-3 rounded-full bg-primary text-white hover:bg-primary-focus flex items-center justify-center"
      >
        <FiSend size={20} />
      </button>
    </div>
  );
}
