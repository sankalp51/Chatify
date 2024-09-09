import Message from './Message';

export default function Messages() {
    return (
        <div className="px-4 flex-1 overflow-auto space-y-2">
            <Message />
            <Message />
            <Message />
            <Message />
        </div>
    );
}
