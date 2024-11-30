import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
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

export default function GroupModal() {
  const axios = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const activeChat = useAppSelector((state) => state.activeChat.activeChat);
  const [showModal, setShowModal] = useState(false);
  const [updatedUsers, setUpdatedUsers] = useState<User[]>(activeChat?.users!);
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState("");

  const handleClick = (id: string) => {
    const filteredUsers = activeChat?.users.filter((u) => u._id !== id);
    setUpdatedUsers([...filteredUsers!]);
  };

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

  const handleUpdateName = () => {
    if (newName.length !== 0) {
      mutate();
    }
    setNameError("Please provide a valid new name");
    return;
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
        {updatedUsers?.map((u) => (
          <UserBadge user={u} handleClick={() => handleClick(u._id)} />
        ))}
      </div>
      <div className="flex justify-center items-center">
        <Input
          value={newName}
          className="mr-1"
          type="text"
          style={{ border: nameError.length && "1px solid red" }}
          placeholder="Chat Name"
          onChange={(e) => {
            setNameError("");
            setNewName(e.target.value);
          }}
        />
        <Button onClick={handleUpdateName}>
          {isPending ? <Spinner /> : "Update"}
        </Button>
      </div>
      {nameError.length ? (
        <p className="text-red-500 text-center">{nameError}</p>
      ) : null}
      <div className="flex flex-col w-full">
        <Input type="search" placeholder="Add new members" />
      </div>
    </Modal>
  );
}
