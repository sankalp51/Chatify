import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [], // Changed back to an array
  status: "idle", 
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload; // Directly assign the array of messages
      state.status = "succeeded";
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const exists = state.messages.find((msg) => msg._id === message._id);
      if (!exists) {
        state.messages.push(message); // Push message to array if it doesn't already exist
      }
    },
    clearMessages: (state) => {
      state.messages = []; // Reset messages to an empty array
      state.status = "idle";
    },
  },
});

export const { setMessages, setStatus, addMessage, clearMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
