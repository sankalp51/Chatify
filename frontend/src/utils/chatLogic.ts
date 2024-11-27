export const getSender = (loggedInUser: User, users: User[]) => {
  return users[0]._id === loggedInUser._id
    ? users[1].firstName
    : users[0].firstName;
};
