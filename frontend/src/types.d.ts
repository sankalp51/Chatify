declare type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: String;
  profilePic: {
    url: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
};

declare type AuthPayload = {
  accessToken: string;
  user: User;
};
