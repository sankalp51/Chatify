import Button from "../Button";
import Input from "../Input";
import { BsSend } from "react-icons/bs";
import { useState } from "react";
import useSendMessage from "../../hooks/useSendMessage";

export default function MessageInput() {
    const [message, setMessage] = useState("");
    const [loading, sendMessage] = useSendMessage();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) {
            return;
        }

        await sendMessage(message);
        setMessage("");

    }
    return (
        <form className="flex items-center gap-2 p-4 bg-base-200" onSubmit={handleSubmit}>
            <Input
                type="text"
                className="input input-bordered input-primary flex-grow"
                placeholder="Send a message"
                value={message}
                onChange={e => setMessage(e.target.value)}
            />
            <Button
                type="submit"
                name={loading ? <span className="loading loading-spinner"></span> : <BsSend />}
                className="btn btn-primary btn-circle"
            />
        </form>
    );
}
