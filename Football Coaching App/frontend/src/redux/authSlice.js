import { createSlice } from "@reduxjs/toolkit";

const getSanitizedToken = () => {
  const token = localStorage.getItem('token');
  if (token === 'null' || token === 'undefined' || token === '[object Object]') {
    localStorage.removeItem('token');
    return null;
  }
  return token || null;
};

const initialState = {
  loading: false,
  user: null,
  token: getSanitizedToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      const incomingToken = action.payload.token;
      const isMalformed = incomingToken === 'null' || incomingToken === 'undefined' || incomingToken === '[object Object]';

      if (incomingToken && !isMalformed) {
        state.token = incomingToken;
        localStorage.setItem('token', incomingToken);
      } else if (isMalformed) {
        state.token = null;
        state.user = null; // Purge user as well to prevent ghost sessions
        localStorage.removeItem('token');
      }

      if (action.payload?.user) {
        state.user = action.payload.user;
      } else if (action.payload && !action.payload.token) {
        // If it's just the user object (no token property at top level)
        state.user = action.payload;
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setLoading, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
