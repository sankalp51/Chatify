import { useAppSelector, useAppDispatch } from "@/redux/store";
import { setActiveChat } from "@/redux/features/activeChatSlice";
import { Users } from "lucide-react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./Spinner";
import { getSender } from "@/utils/chatLogic";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import Modal from "./Modal";
import { setChats } from "@/redux/features/chatSlice";
import CreateGroupForm from "./CreateGroupForm";
import { useState } from "react";

export default function MyChats() {
  const axios = useAxiosPrivate();
  const selectedChat = useAppSelector((state) => state.activeChat.activeChat);
  const auth = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["chats"],
    queryFn: async function () {
      try {
        const response = await axios.get<Chat[]>("/api/chats/get-chats");
        dispatch(setChats(response.data));
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            error.response?.data.message || "Failed to fetch chats"
          );
        }
      }
    },
  });

  return (
    <div
      className={`${
        selectedChat ? "hidden" : "flex"
      } md:flex flex-col mt-2 items-center h-[calc(100vh-90px)] rounded-md p-3 bg-muted w-full md:w-[31%]`}
    >
      <div className="pb-3 px-3 text-[28px] md:text-[30px] flex flex-wrap gap-2 w-full justify-between items-center">
        <h2 className="text-3xl">My Chats</h2>
        <Modal
          open={isModalOpen}
          handleModalOpen={setIsModalOpen}
          title="Create Group Chat"
          description="modal to create a group chat"
          trigger={
            <Button onClick={() => setIsModalOpen(true)}>
              <Users /> New Group chat
            </Button>
          }
        >
          <CreateGroupForm onModalOpen={() => setIsModalOpen(false)} />
        </Modal>
      </div>
      <div className="flex flex-col p-3 w-full h-full overflow-y-hidden">
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="text-center text-red-500">
            <p>Oops! Something went wrong.</p>
            <p>{error?.message || "Unable to load chats."}</p>
          </div>
        ) : (
          <div className="overflow-y-auto">
            {data &&
              data.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => dispatch(setActiveChat(chat))}
                  className={`cursor-pointer bg-muted px-3 py-2 rounded-lg ${
                    selectedChat?._id === chat._id && "bg-primary text-white"
                  }`}
                >
                  {!chat.isGroupChat ? getSender(auth!, chat.users) : chat.name}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
