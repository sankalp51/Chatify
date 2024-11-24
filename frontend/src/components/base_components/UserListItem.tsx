import Avtar from "./Avtar";

type Props = {
  user: User;
};

export default function UserListItem({ user }: Props) {
  return (
    <div className="flex justify-center items-center space-x-4 hover:bg-secondary cursor-pointer transition bg-muted rounded-md px-4 py-2 mb-2">
      <Avtar
        profileUrl={user.profilePic.url}
        name={`${user.firstName} ${user.lastName}`}
      />
      <div className="flex-1">
        <p className="w-full">{`${user.firstName} ${user.lastName}`}</p>
        <p className="w-3/4">{user.email}</p>
      </div>
    </div>
  );
}
