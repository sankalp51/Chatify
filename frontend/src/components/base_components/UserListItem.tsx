import Avtar from "./Avtar";
import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useAppDispatch } from "@/redux/store";
import { setActiveChat } from "@/redux/features/activeChatSlice";
import { AxiosError } from "axios";
import { toast } from "sonner";
import Spinner from "./Spinner";

type Props = {
  user: User;
  onSheetOpen: (open: boolean) => void;
};

export default function UserListItem({ user, onSheetOpen }: Props) {
  const axios = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const { isPending, mutate } = useMutation({
    mutationFn: async function (id: string) {
      const response = await axios.post<Chat>(
        "/api/chats/create-chat",
        {
          userId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: function (data) {
      onSheetOpen(false);
      dispatch(setActiveChat(data));
    },
    onError: function (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    },
  });

  const handleClick = () => {
    mutate(user._id);
  };
  return (
    <div
      onClick={() => handleClick()}
      className="flex justify-center items-center space-x-4 hover:bg-secondary cursor-pointer transition bg-muted rounded-md px-4 py-2 mb-2"
    >
      <Avtar
        profileUrl={user.profilePic.url}
        name={`${user.firstName} ${user.lastName}`}
      />
      <div className="flex-1">
        <p className="w-full">{`${user.firstName} ${user.lastName}`}</p>
        <p className="w-3/4">{user.email}</p>
      </div>
      {isPending && <Spinner />}
    </div>
  );
}
