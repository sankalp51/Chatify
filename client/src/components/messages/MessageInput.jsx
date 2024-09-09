import Button from "../Button";
import Input from "../Input";
import { BsSend } from "react-icons/bs";

export default function MessageInput() {
    return (
        <form className="flex items-center gap-2 p-4 bg-base-200">
            <Input
                type="text"
                className="input input-bordered input-primary flex-grow"
                placeholder="Send a message"
            />
            <Button
                type="submit"
                name={<BsSend />}
                className="btn btn-primary btn-circle"
            />
        </form>
    );
}
