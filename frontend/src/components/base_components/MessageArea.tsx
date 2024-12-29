import { SendHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import useTheme from "@/hooks/useTheme";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "@/utils/chatLogic";
import ToolTip from "./ToolTip";
import Avtar from "./Avtar";
import { socket } from "../../socket";
import Typing from "./Typing";
import {
  addNotification,
  removeNotification,
} from "@/redux/features/notificationsSlice";
import { queryClient } from "@/main";

type Props = {
  messages: Message[];
};

export default function MessageArea({ messages }: Props) {
  const { theme } = useTheme();
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState(messages);
  const messageRef = useRef<HTMLSpanElement>(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const axios = useAxiosPrivate();
  const selectedChat = useAppSelector((state) => state.activeChat.activeChat);
  const activeUser = useAppSelector((state) => state.auth.user);
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const thisChatNotification = notifications?.find(
      (ntf) => ntf.chat._id === selectedChat?._id
    );
    if (thisChatNotification) {
      dispatch(removeNotification(thisChatNotification?._id));
    }
  }, []);

  useEffect(() => {
    socket.on("is typing", () => {
      setIsTyping(true);
    });
    socket.on("typing stopped", () => setIsTyping(false));
    return () => {
      socket.off("is typing");
      socket.off("typing stopped");
    };
  }, []);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView();
    }
  }, [allMessages]);

  useEffect(() => {
    socket.on("message received", (message: Message) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      if (!selectedChat || selectedChat?._id !== message.chat._id) {
        dispatch(addNotification(message));
        return;
      }
      setAllMessages((prevState) => [...prevState, message]);
    });

    return () => {
      socket.off("message received");
    };
  }, [selectedChat, notifications]);

  const { mutate } = useMutation({
    mutationFn: async function (message: string) {
      try {
        socket.emit("stop typing", selectedChat?._id);
        const response = await axios.post<Message>(
          "/api/messages/new-message",
          {
            chatId: selectedChat?._id,
            content: message,
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
      socket.emit("new message", data);
      setAllMessages([...allMessages, data!]);
    },
    onError: function (error) {
      toast.error(error.message);
    },
  });

  const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat?._id);
    }
    const lastTypingTime = new Date().getTime();
    const typingTimeout = 3000;

    setTimeout(() => {
      const now = new Date().getTime();
      if (now - lastTypingTime >= typingTimeout && typing) {
        setTyping(false);
        socket.emit("stop typing", selectedChat?._id);
      }
    }, typingTimeout);
  };

  const handleEnterClick = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" && newMessage.length) {
      mutate(newMessage);
      setNewMessage("");
    }
  };

  const handleSubmit = () => {
    if (newMessage.length) {
      mutate(newMessage);
      setNewMessage("");
    }
  };
  return (
    <section className="w-full h-full flex justify-between flex-col">
      <div className="w-full h-full overflow-y-auto">
        {allMessages?.map((message, index) => {
          return (
            <div className="flex p-2 gap-1" key={message._id}>
              {isSameSender(allMessages, message, index, activeUser?._id!) && (
                <ToolTip
                  info={message.sender.firstName}
                  mainMessage={
                    <Avtar
                      name={`${message.sender.firstName} ${message.sender.lastName}`}
                      profileUrl={message.sender.profilePic.url}
                    />
                  }
                />
              )}
              {isLastMessage(allMessages, index, activeUser?._id!) && (
                <Avtar
                  name={`${message.sender.firstName} ${message.sender.lastName}`}
                  profileUrl={message.sender.profilePic.url}
                />
              )}
              <span
                style={{
                  marginLeft: isSameSenderMargin(
                    allMessages,
                    message,
                    index,
                    activeUser?._id!
                  ),
                  marginTop: isSameUser(allMessages, message, index) ? 3 : 0,
                  color:
                    theme === "light" && message.sender._id !== activeUser?._id
                      ? "white"
                      : "",
                }}
                ref={index === allMessages.length - 1 ? messageRef : null}
                className={`${
                  message.sender._id === activeUser?._id
                    ? "bg-secondary"
                    : "bg-primary"
                } rounded-[20px] py-[5px] px-[15px] max-w-[75%]`}
              >
                {message.content}
              </span>
            </div>
          );
        })}
        {isTyping && <Typing />}
      </div>
      <div className="self-end w-full justify-center items-center gap-2 p-2 flex h-[10%] bg-secondary rounded-md">
        <Input
          onChange={typingHandler}
          type="text"
          value={newMessage}
          onKeyDown={handleEnterClick}
          placeholder="Type your message"
          className="bg-muted"
        />
        <Button onClick={handleSubmit} className="rounded-full h-[2.9rem]">
          <SendHorizontal />
        </Button>
      </div>
    </section>
  );
}
