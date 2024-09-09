import Messages from "./Messages";
import MessageInput from "./MessageInput";
import NotChatSelected from "../NoChatSelected";
import useConversation from "../../zustand/useConversation";
import { useEffect } from "react";

export default function MessageContainer() {
    const { selectedConversation, setSelectedConversation } = useConversation();
    
    // Reset selected conversation on unmount
    useEffect(() => {
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    return (
        <>
            {selectedConversation ? (
                <section className="flex flex-col flex-grow h-full">
                    <header className="bg-slate-500 px-4 py-2">
                        <span className="label-text">To:</span>
                        <span className="text-gray-900 font-bold">{selectedConversation?.fullName}</span>
                    </header>
                    
                    {/* Messages container: Make it scrollable */}
                    <div className="flex-1 overflow-auto px-4">
                        <Messages />
                    </div>

                    {/* MessageInput stays sticky at the bottom */}
                    <div className="sticky bottom-0 p-4 bg-base-200">
                        <MessageInput />
                    </div>
                </section>
            ) : (
                <NotChatSelected />
            )}
        </>
    );
}
