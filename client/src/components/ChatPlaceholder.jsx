import React from "react";

export default function ChatPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-base-100">
      <h2 className="text-2xl font-semibold mb-2">Welcome to the Chat App!</h2>
      <p className="text-gray-500 mb-4">
        Select a conversation to start chatting.
      </p>
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-12 h-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2-4H7a4 4 0 010-8h10a4 4 0 110 8z"
          />
        </svg>
      </div>
      <p className="text-gray-500">Select a chat to view the conversation.</p>
    </div>
  );
}
