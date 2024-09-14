import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.status = "succeeded";
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.status = "idle";
    },
  },
});

export const { setMessages, setStatus, addMessage, clearMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
