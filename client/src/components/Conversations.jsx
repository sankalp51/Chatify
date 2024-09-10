import Conversation from "./Conversation";
import useGetConversation from "../hooks/useGetConversations";

export default function Conversations() {
  const { loading, conversations } = useGetConversation();
  return (
    <section className="flex flex-col space-y-2 overflow-auto">
      {loading && <span className="loading loading-spinner mx-auto"></span>}
      {!loading && conversations.map(convo => {
        return (
          <Conversation key={convo._id} {...convo} />
        )
      })}
    </section>
  );
}
