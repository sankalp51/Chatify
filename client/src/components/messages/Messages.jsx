import Message from './Message';
import useGetMessage from '../../hooks/useGetMessage';
import MessageSkeleton from '../skeletons/MessageSkeleton';
import { useEffect, useRef } from "react";
import useMessage from '../../hooks/useMessages';

export default function Messages() {
    const { loading, messages } = useGetMessage();
    useMessage();
    const lastMessageRef = useRef();
    useEffect(() => {
        setTimeout(() => {
            lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
    }, [messages]);
    return (
        <div className="px-4 flex-1 overflow-auto space-y-2">
            {loading && [...Array(3)].map((_, id) => <MessageSkeleton key={id} />)}
            {!loading && !messages.length && <p>Make the first move! start a convo</p>}
            {!loading && messages.length && messages.map(message => <div key={message._id} ref={lastMessageRef}><Message message={message} /></div>)}
        </div>
    );
}
