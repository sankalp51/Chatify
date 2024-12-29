import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  notifications: Message[] | null;
};

const initialState: InitialState = {
  notifications: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: function (state, action: PayloadAction<Message>) {
      if (!state.notifications) {
        state.notifications = [action.payload];
      } else {
        state.notifications.push(action.payload);
      }
    },

    removeNotification: function (state, action: PayloadAction<string>) {
      state.notifications = state.notifications?.filter(
        (notification) => notification._id !== action.payload
      )!;
    },
  },
});

export const { removeNotification, addNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
