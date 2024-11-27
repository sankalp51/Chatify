import { X } from "lucide-react";

type Props = {
  user: User;
  handleClick: () => void;
};

export default function UserBadge({ user, handleClick }: Props) {
  return (
    <div
      onClick={handleClick}
      className="px-2 py-1 rounded-lg m-1 mb-2 text-[12px] text-white bg-purple-700 cursor-pointer justify-center flex items-center"
    >
      {user.firstName}
      <X className="pl-1" size={15} />
    </div>
  );
}
