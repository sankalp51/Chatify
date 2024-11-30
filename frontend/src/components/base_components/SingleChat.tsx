import { useAppSelector, useAppDispatch } from "@/redux/store";
import { setActiveChat } from "@/redux/features/activeChatSlice";
import { Button } from "../ui/button";
import chatify from "../../images/chat.png";
import { MoveLeft } from "lucide-react";
import { getSender } from "@/utils/chatLogic";
import ProfileModal from "./ProfileModal";
import GroupModal from "./GroupModal";

export default function SingleChat() {
  const user = useAppSelector((state) => state.auth.user);
  const selectedChat = useAppSelector((state) => state.activeChat.activeChat);
  const chatPartner = selectedChat?.users.find((u) => u._id !== user?._id);
  const dispatch = useAppDispatch();
  return (
    <>
      {selectedChat ? (
        <div className="flex justify-between items-center w-full bg-secondary p-2 rounded-sm">
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
      ) : (
        <div className="flex flex-col w-full h-full justify-center items-center">
          <img
            src={chatify}
            alt="chatify icon"
            className="w-1/2 md:w-1/4 lg:w-1/6 max-w-xs h-auto"
          />
          <p className="text-3xl font-sans">Select a user to start texting </p>
        </div>
      )}
    </>
  );
}
