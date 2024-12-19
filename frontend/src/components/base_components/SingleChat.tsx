import { useAppSelector, useAppDispatch } from "@/redux/store";
import { setActiveChat } from "@/redux/features/activeChatSlice";
import { Button } from "../ui/button";
import { MoveLeft } from "lucide-react";
import { getSender } from "@/utils/chatLogic";
import ProfileModal from "./ProfileModal";
import GroupModal from "./GroupModal";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import Spinner from "./Spinner";
import ChatIntro from "./ChatIntro";
import { useEffect } from "react";
import MessageArea from "./MessageArea";

export default function SingleChat() {
  const user = useAppSelector((state) => state.auth.user);
  const selectedChat = useAppSelector((state) => state.activeChat.activeChat);
  const chatPartner = selectedChat?.users.find((u) => u._id !== user?._id);
  const dispatch = useAppDispatch();
  const axios = useAxiosPrivate();

  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["messages", selectedChat?._id],
    queryFn: async function () {
      try {
        if (!selectedChat?._id) return [];
        const response = await axios.get<Message[]>(
          `/api/messages/get-message/${selectedChat._id}`
        );
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data.message);
        }
      }
    },
    enabled: false,
  });

  useEffect(() => {
    if (selectedChat) {
      refetch();
    }
  }, [selectedChat, refetch]);

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col w-full h-full">
          {/* Chat header */}
          <div className="flex justify-between items-center w-full p-2 rounded-sm bg-secondary">
            <Button
              onClick={() => dispatch(setActiveChat(null))}
              className="flex md:hidden justify-center items-center"
            >
              <MoveLeft />
            </Button>
            <p className="text-[28px] md:text-[30px] pb-3 px-2">
              {!selectedChat.isGroupChat
                ? getSender(user!, selectedChat.users)
                : selectedChat.name.toUpperCase()}
            </p>
            {!selectedChat.isGroupChat ? (
              <ProfileModal user={chatPartner!} />
            ) : (
              <GroupModal />
            )}
          </div>

          {/* Message area */}
          <div className="flex-grow w-full overflow-y-auto">
            {isFetching ? (
              <div className="flex w-full h-full justify-center items-center">
                <Spinner />
              </div>
            ) : error?.message ? (
              <div className="flex w-full h-full justify-center items-center">
                <p className="text-red-500 font-bold">{error?.message}</p>
              </div>
            ) : (
              <MessageArea messages={data!} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full justify-center items-center">
          <ChatIntro />
        </div>
      )}
    </>
  );
}
