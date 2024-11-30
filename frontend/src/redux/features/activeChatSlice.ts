import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  activeChat: Chat | null;
};

const initialState: InitialState = {
  activeChat: null,
};

const activeChatSlice = createSlice({
  name: "activeChat",
  initialState,
  reducers: {
    setActiveChat(state, action: PayloadAction<Chat | null>) {
      state.activeChat = action.payload;
    },
    clearActiveChat(state) {
      state.activeChat = null;
    },
  },
});

export const { setActiveChat, clearActiveChat } = activeChatSlice.actions;
export default activeChatSlice.reducer;
