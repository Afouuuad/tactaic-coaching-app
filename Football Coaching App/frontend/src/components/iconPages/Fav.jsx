import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    jobs: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      state.jobs.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.jobs = state.jobs.filter(job => job._id !== action.payload);
    },
  },
});

export const { addFavorite, removeFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
