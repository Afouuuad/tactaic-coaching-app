import { createSlice } from '@reduxjs/toolkit';

// This is the initial state for the player-related data.
// It starts with an empty array for the team roster.
const initialState = {
  players: [] // holds an array of player objects
};

/**
 * Creates a Redux slice to manage the state for players.
 * This includes the team roster and any data related to individual players.
 */
const playerSlice = createSlice({
  name: 'player', // The name of the slice in the Redux store
  initialState,
  reducers: {
    /**
     * Reducer to set the list of players in the state.
     * It replaces the existing player list with the new one provided in the action payload.
     * @param {object} state - The current state.
     * @param {object} action - The action containing the payload (the new array of players).
     */
    setPlayers: (state, action) => {
      state.players = action.payload;
    }
    // You can add more player-related reducers here, for example:
    // addPlayer: (state, action) => { state.players.push(action.payload); },
    // removePlayer: (state, action) => { state.players = state.players.filter(p => p.id !== action.payload); },
  }
});

// Export the action creators to be used in your components
export const { setPlayers } = playerSlice.actions;

// Export the reducer to be included in the Redux store
export default playerSlice.reducer;
