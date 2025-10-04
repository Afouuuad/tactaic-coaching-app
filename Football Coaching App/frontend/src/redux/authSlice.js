import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      // Expect payload to be an object with user and token properties.
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setLoading, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
