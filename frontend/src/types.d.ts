declare type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: String;
  profilePic: {
    url: string;
    id?: string;
  };
  createdAt: string;
  updatedAt: string;
};


declare type Chat = {
  _id: string;
  name: string;
  isGroupChat: boolean;
  users: User[];
  createdAt: string;
  groupAdmin?: User;
  latestMessage?: {
    sender: User;
    content: string;
    chat: Chat;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

declare type AuthPayload = {
  accessToken: string;
  user: User;
};

type Sender = Pick<User, "_id" | "firstName" | "lastName" | "profilePic">;

type ChatWithUsers = Omit<Chat, "users"> & {
  users: Sender[];
};

type Message = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  sender: Sender;
  content: string;
  chat: ChatWithUsers;
  createdAt: string;
  updatedAt: string;
};
