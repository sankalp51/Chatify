import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  chats: Chat[] | null;
};
const initialState: InitialState = {
  chats: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
  },
});

export const { setChats } = chatSlice.actions;
export default chatSlice.reducer;
