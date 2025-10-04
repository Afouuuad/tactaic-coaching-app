import { createSlice } from '@reduxjs/toolkit';

/**
 * The initial state for the plan slice. It holds arrays for game plans
 * and training activities, and a property for the currently active plan.
 */
const initialState = {
  gamePlans: [],
  activities: [],
  activePlan: null,
};

/**
 * Creates a Redux slice to manage the state for tactical plans and the activity library.
 */
const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    // --- Reducers (Actions) ---

    /**
     * Sets the list of all available game plans.
     */
    setGamePlans: (state, action) => {
      state.gamePlans = action.payload;
    },

    /**
     * Sets the library of all training activities.
     */
    setActivities: (state, action) => {
      state.activities = action.payload;
    },

    /**
     * Sets the currently active game plan for the team.
     */
    setActivePlan: (state, action) => {
      state.activePlan = action.payload;
    },

    /**
     * Adds a new training activity to the library.
     */
    addActivity: (state, action) => {
      state.activities.unshift(action.payload);
    },
  },
});

// --- Export Action Creators ---
export const {
  setGamePlans,
  setActivities,
  setActivePlan,
  addActivity,
} = planSlice.actions;

// --- Export Reducer ---
export default planSlice.reducer;
