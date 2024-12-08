import { useQuery, useMutation } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { setActiveChat } from "@/redux/features/activeChatSlice";
import { Input } from "../ui/input";
import Modal from "./Modal";
import { User } from "lucide-react";
import UserBadge from "./UserBadge";
import { Button } from "../ui/button";
import { AxiosError } from "axios";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Spinner from "./Spinner";
import { queryClient } from "@/main";
import Avtar from "./Avtar";

export default function GroupModal() {
  const axios = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const activeChat = useAppSelector((state) => state.activeChat.activeChat);
  const loggedInUser = useAppSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [updatedUsers, setUpdatedUsers] = useState<User[]>([
    ...activeChat?.users!,
  ]);
  const [newName, setNewName] = useState(activeChat?.name!);
  const [searchItem, setSearchItem] = useState("");
  const [nameError, setNameError] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");

  useEffect(() => {
    setNameError("");
    setNewName(activeChat?.name!);
    setUpdatedUsers(activeChat?.users!);
    setSearchItem("");
    setDebounceSearch("");
  }, [showModal]);

  const { isError, isLoading, error, data } = useQuery({
    queryKey: ["users", debounceSearch],
    queryFn: async () => {
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
    enabled: !!debounceSearch,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async function () {
      try {
        const response = await axios.patch<Chat>(
          "/api/chats/rename-group",
          {
            chatId: activeChat?._id,
            chatName: newName,
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
      toast.success(`successfully updated group name to ${newName}`);
      setShowModal(false);
      dispatch(setActiveChat(data!));
      setNewName("");
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: function (error) {
      toast.error(error.message);
    },
  });

  const { isPending: addUserPending, mutate: addUser } = useMutation({
    mutationFn: async function (id: string) {
      try {
        const response = await axios.patch<Chat>(
          "/api/chats/add-member",
          {
            chatId: activeChat?._id,
            userId: id,
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
      toast.success("successfully added new user to the group");
      setShowModal(false);
      dispatch(setActiveChat(data!));
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: function (error) {
      toast.error(error.message);
    },
  });

  const { isPending: removeUserPending, mutate: removeUser } = useMutation({
    mutationFn: async function (id: string) {
      try {
        const response = await axios.patch<Chat>(
          "/api/chats/remove-member",
          {
            chatId: activeChat?._id,
            userId: id,
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
          toast.error(error.response?.data.message);
        }
      }
    },
    onSuccess: function (data) {
      toast.success("successfully removed from the group");
      dispatch(setActiveChat(data!));
    },
    onError: function (error) {
      toast.error(error.message);
    },
  });

  const handleUpdateName = () => {
    if (newName.length !== 0) {
      mutate();
      return;
    }
    setNameError("Please provide a valid new name");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchItem(value);
    setTimeout(() => {
      setDebounceSearch(value.trim());
    }, 500);
  };

  const handleAddMember = (user: User) => {
    const userAlreadyExists = updatedUsers.find((u) => u._id === user._id);
    if (userAlreadyExists) {
      toast.warning("User already exists in the group");
      return;
    }
    addUser(user._id);
  };

  const handleClick = (id: string) => {
    if (activeChat?.groupAdmin?._id !== loggedInUser?._id) {
      toast.error("Not allowed to remove members");
      return;
    }
    const filteredUsers = updatedUsers.filter((user) => user._id !== id);
    removeUser(id);
    setUpdatedUsers([...filteredUsers]);
  };

  return (
    <Modal
      trigger={<User />}
      title={activeChat?.name!}
      description={`a modal displaying details of ${activeChat?.name}'s details`}
      open={showModal}
      handleModalOpen={setShowModal}
    >
      <div className="w-full flex flex-wrap pb-3">
        {removeUserPending ? (
          <Spinner />
        ) : (
          updatedUsers?.map((u) => (
            <UserBadge
              user={u}
              handleClick={() => handleClick(u._id)}
              key={u._id}
            />
          ))
        )}
      </div>
      <div className="flex justify-center items-center">
        <Input
          value={newName}
          className="mr-1"
          type="text"
          disabled={loggedInUser?._id !== activeChat?.groupAdmin?._id}
          style={{ border: nameError.length && "1px solid red" }}
          placeholder="Chat Name"
          onChange={(e) => {
            setNameError("");
            setNewName(e.target.value);
          }}
        />
        {loggedInUser?._id === activeChat?.groupAdmin?._id && (
          <Button onClick={handleUpdateName}>
            {isPending ? <Spinner /> : "Update"}
          </Button>
        )}
      </div>
      {nameError.length ? (
        <p className="text-red-500 text-center">{nameError}</p>
      ) : null}
      {loggedInUser?._id === activeChat?.groupAdmin?._id && (
        <div className="flex flex-col w-full gap-2">
          <Input
            type="search"
            placeholder="Add new members"
            value={searchItem}
            onChange={handleSearchChange}
          />
          <div className="flex flex-col justify-center overflow-y-auto w-full">
            {(isLoading || addUserPending) && <Spinner />}
            {data && data.length
              ? data.slice(0, 3).map((user) => {
                  const memberExists = updatedUsers.find(
                    (u) => u._id === user._id
                  );
                  return (
                    <div
                      key={user._id}
                      onClick={() => handleAddMember(user)}
                      className={`flex justify-center items-center space-x-4 ${
                        !memberExists && "hover:bg-secondary"
                      } cursor-pointer transition rounded-md px-4 py-2 mb-2 ${
                        memberExists ? "bg-primary" : "bg-muted"
                      }`}
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
              : null}

            {isError && (
              <p className="text-red-500 text-center">{error.message}</p>
            )}
          </div>
        </div>
      )}
      <Button
        onClick={() => setShowModal(false)}
        className="w-full bg-destructive hover:bg-red-700"
      >
        Close
      </Button>
    </Modal>
  );
}
