import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChangeEvent, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import Avtar from "./Avtar";
import Spinner from "./Spinner";
import { toast } from "sonner";
import UserBadge from "./UserBadge";
import { queryClient } from "@/main";
import { useAppDispatch } from "@/redux/store";
import { setActiveChat } from "@/redux/features/activeChatSlice";

type Props = {
  onModalOpen: () => void;
};

export default function CreateGroupForm({ onModalOpen }: Props) {
  const axios = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const [chatName, setChatName] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [debouncSearch, setDebounceSearch] = useState("");

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["users", debouncSearch],
    queryFn: async function () {
      try {
        const response = await axios.get<User[]>(
          `/api/users/all-users?search=${searchItem}`
        );
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data.message);
        }
      }
    },
    enabled: !!debouncSearch,
  });

  const {
    isPending,
    mutate,
    error: groupError,
  } = useMutation({
    mutationFn: async function () {
      try {
        const response = await axios.post<Chat>(
          "/api/chats/create-group",
          {
            name: chatName,
            users: selectedUsers.map((u) => u._id),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data.message);
        }
      }
    },
    onSuccess: function (data) {
      dispatch(setActiveChat(data!));
      onModalOpen();
      toast.success(`Successfully created ${chatName} group`);
      queryClient.invalidateQueries();
    },
    onError: function () {
      toast.error(groupError?.message);
    },
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchItem(value);
    setTimeout(() => {
      setDebounceSearch(value.trim());
    }, 500);
  };

  const handleAddGroupMembers = (user: User) => {
    const memberExists = selectedUsers.find((u) => u._id === user._id);
    if (memberExists) {
      toast.warning("user already selected");
      return;
    }
    setSelectedUsers((pervState) => [...pervState, user]);
  };

  const handleRemoveGroupMembers = (id: string) => {
    const filteredUsers = selectedUsers.filter((user) => user._id !== id);
    setSelectedUsers([...filteredUsers]);
  };

  const handleCreateGroup = () => {
    if (selectedUsers.length < 2) {
      toast.error("Please select more than 2 group members");
      return;
    }
    mutate();
  };
  return (
    <>
      <Input
        type="text"
        placeholder="Chat Name"
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Search and select users"
        value={searchItem}
        onChange={handleSearch}
      />
      <div className="flex flex-wrap w-full">
        {selectedUsers.map((u) => {
          return (
            <UserBadge
              user={u}
              handleClick={() => handleRemoveGroupMembers(u._id)}
            />
          );
        })}
      </div>
      {isLoading ? (
        <span className="text-center">
          <Spinner />
        </span>
      ) : isError ? (
        <p className="text-center text-red-500">{error.message}</p>
      ) : (
        data?.slice(0, 4).map((user) => {
          return (
            <div
              onClick={() => handleAddGroupMembers(user)}
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
            </div>
          );
        })
      )}
      <Button onClick={handleCreateGroup}>
        {isPending ? <Spinner /> : "Create Group"}
      </Button>
    </>
  );
}
