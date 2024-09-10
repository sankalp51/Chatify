import Input from "../Input";
import Button from '../Button';
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import useConversation from "../../zustand/useConversation";
import useGetConversation from "../../hooks/useGetConversations"
import { toast } from "sonner";

export default function SearchInput() {
    const [searchItem, setSearchItem] = useState("");
    const { setSelectedConversation } = useConversation();
    const { conversations } = useGetConversation();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!searchItem) return;
        if (searchItem.length < 3) {
            return toast.error("search must be more than 3 characters long")
        }

        const conversation = conversations.find(c => c.fullName.toLowerCase().includes(searchItem.toLowerCase()))
        if (conversation) {
            setSelectedConversation(conversation);
            setSearchItem("");
        }
        else {
            toast.error("No such user found");
        }
    }

    return (
        <form className="flex items-center gap-2 w-full" onSubmit={handleSubmit}>
            <div className="flex-1">
                <Input
                    value={searchItem}
                    onChange={e => setSearchItem(e.target.value)}
                    type="text"
                    placeholder="Search..."
                    className="input input-bordered rounded-full w-full"
                />
            </div>
            <Button
                type="submit"
                className="btn btn-circle btn-primary flex-shrink-0"
                name={<FaSearch />}
            />
        </form>
    );
}
