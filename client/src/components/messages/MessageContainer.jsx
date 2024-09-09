import Messages from "./Messages";
import MessageInput from "./MessageInput";
import NotChatSelected from "../NoChatSelected";

export default function MessageContainer() {
    const noChatSelected = true;
    return (
        <>{!noChatSelected ? (
            <section className="flex flex-col flex-grow h-full">
                <header className="bg-slate-500 px-4 py-2">
                    <span className="label-text">To:</span>
                    <span className="text-gray-900 font-bold">John Doe</span>
                </header>
                <div className="flex-1 overflow-auto px-4">
                    <Messages />
                </div>
                <div className="p-4">
                    <MessageInput />
                </div>
            </section>
        ) : (
            <NotChatSelected />
        )}
        </>
    );
}
