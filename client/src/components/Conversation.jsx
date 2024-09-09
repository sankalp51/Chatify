import useConversation from "../zustand/useConversation";

export default function Conversation({ name, ...rest }) {
  const data = { ...rest };
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === data._id;
  console.log(selectedConversation);
  console.log(isSelected)
  return (
    <article className={`flex gap-3 items-center hover:bg-primary hover:text-primary-content rounded-lg p-2 cursor-pointer transition-all ${isSelected && 'bg-primary text-primary-content'}`}
      onClick={() => setSelectedConversation(data)}>
      <div className="avatar online">
        <div className="w-12 rounded-full">
          <img src={data.profilePic} alt="user avatar" />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between">
          <p className="font-bold">{data.fullName}</p>
        </div>
      </div>
    </article>
  );
}
