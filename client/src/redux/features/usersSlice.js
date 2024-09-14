import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  selectedUser: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload; // Update the global state with the fetched users
    },
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { setUsers, selectUser } = usersSlice.actions;

export default usersSlice.reducer;
