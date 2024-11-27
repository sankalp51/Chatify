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

declare type Message = {
  sender: User;
  content: string;
  chat: Chat;
};

declare type Chat = {
  _id: string;
  name: string;
  isGroupChat: boolean;
  users: User[];
  createdAt: string;
  groupAdmin?: User;
  latestMessage?: Message;
  updatedAt: string;
  __v?: number;
};

declare type AuthPayload = {
  accessToken: string;
  user: User;
};
