import Messages from "./Messages";
import MessageInput from "./MessageInput";
import NotChatSelected from "../NoChatSelected";
import useConversation from "../../zustand/useConversation";
import { useEffect } from "react";

export default function MessageContainer() {
    const { selectedConversation, setSelectedConversation } = useConversation();
    useEffect(() => {
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);
    return (
        <>
            {selectedConversation ? (  // Check if selectedConversation exists (truthy)
                <section className="flex flex-col flex-grow h-full">
                    <header className="bg-slate-500 px-4 py-2">
                        <span className="label-text">To:</span>
                        <span className="text-gray-900 font-bold">{selectedConversation?.fullName}</span>
                    </header>
                    <div className="flex-1 overflow-auto px-4">
                        <Messages />
                    </div>
                    <div className="p-4">
                        <MessageInput />
                    </div>
                </section>
            ) : (  // Fallback UI when no conversation is selected
                <NotChatSelected />
            )}
        </>
    );
}
