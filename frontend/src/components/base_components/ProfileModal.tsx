import Modal from "./Modal";
import { User } from "lucide-react";

type Props = {
  user: User;
};

export default function ProfileModal({ user }: Props) {
  return (
    <Modal
      title={`${user.firstName} ${user.lastName}`}
      description="profile modal"
      trigger={<User />}
    >
      <div className="flex flex-col justify-center items-center gap-8 h-[40vh]">
        <img
          src={user.profilePic.url}
          alt={user.firstName}
          className="h-[70%] w-[43%] rounded-full"
        />
        <h1 className="text-2xl text-center">{`${user.email}`}</h1>
      </div>
    </Modal>
  );
}
