import { FiMessageCircle } from "react-icons/fi";

export default function NoMessages() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
      <FiMessageCircle className="text-6xl mb-4" />
      <h2 className="text-xl font-semibold mb-2">No messages yet</h2>
      <p className="mb-4">
        Start a conversation and your messages will appear here.
      </p>
      <button className="btn btn-primary">Start Chatting</button>{" "}
    </div>
  );
}
