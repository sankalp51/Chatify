import useAuth from "../../hooks/useAuth";
import useConversation from "../../zustand/useConversation";
import { format, isToday } from 'date-fns';

export default function Message({ message }) {
    const { auth } = useAuth();
    const { selectedConversation } = useConversation();
    const messageDate = new Date(message.createdAt);
    const isMessageToday = isToday(messageDate);
    const fromMe = message.sender === auth.id;
    const chatClass = fromMe ? 'chat-end' : 'chat-start';
    const profilePic = fromMe ? auth.profilePic : selectedConversation?.profilePic;
    const bubbleBgColour = fromMe && 'bg-primary';

    const formattedTime = isMessageToday
        ? format(messageDate, 'h:mm a')  // Show time if it's today
        : format(messageDate, 'MMM dd, yyyy');  // Show date if it's not today

    return (
        <div className={`chat ${chatClass}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img src={profilePic} alt="user avatar" />
                </div>
            </div>
            <div className={`chat-bubble text-white ${bubbleBgColour}`}>
                {message.message}
            </div>
            <div className="chat-footer text-xs dark text-primary mt-1 opacity-70 flex gap-1 items-center">
                {formattedTime}
            </div>
        </div>
    );
}
