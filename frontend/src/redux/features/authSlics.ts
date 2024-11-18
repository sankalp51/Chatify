import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogIn: function (state, action: PayloadAction<AuthPayload>) {
      (state.accessToken = action.payload.accessToken),
        (state.user = action.payload.user);
    },
    setLogout: function (state) {
      (state.accessToken = null), (state.user = null);
    },
  },
});

export const { setLogIn, setLogout } = authSlice.actions;
export default authSlice.reducer;
