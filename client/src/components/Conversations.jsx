import Conversation from "./Conversation";

export default function Conversations() {
  return (
    <section className="flex flex-col space-y-2 overflow-auto">
      <Conversation />
      <Conversation />
      <Conversation />
    </section>
  );
}
