import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./features/authSlics";
import chatsReducer from "./features/chatSlice";
import activeChatReducer from "./features/activeChatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    activeChat: activeChatReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
