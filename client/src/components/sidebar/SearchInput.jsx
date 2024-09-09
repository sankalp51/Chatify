import Input from "../Input";
import Button from '../Button';
import { FaSearch } from "react-icons/fa";

export default function SearchInput() {
    return (
        <form className="flex items-center gap-2 w-full">
            <div className="flex-1">
                <Input
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
