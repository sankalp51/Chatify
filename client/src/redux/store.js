import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/usersSlice";
import messagesReducer from "./features/messageSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    messages: messagesReducer,
  },
});

export default store;
