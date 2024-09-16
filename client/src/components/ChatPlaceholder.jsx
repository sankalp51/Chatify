import React from "react";

export default function ChatPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-base-100">
      <div className="w-24 h-24 mb-6">
        {/* App Icon */}
        <img
          src="/chat.png"
          alt="Chatify Icon"
          className="w-full h-full object-contain"
        />
      </div>
      <h2 className="text-3xl font-bold mb-2 text-primary">Welcome to Chatify!</h2>
      <p className="text-gray-600 mb-4">
        Select a conversation to start chatting.
      </p>
    </div>
  );
}
