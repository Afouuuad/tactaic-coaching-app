import { createSlice } from "@reduxjs/toolkit";

/**
 * The initial state for the event slice.
 * It holds arrays for all events, a single selected event for detail views,
 * and state for search/filter functionality.
 */
const initialState = {
  allEvents: [],
  selectedEvent: null,
  searchedQuery: "",
  // allAdminEvents could be used for an admin moderation view if needed
  allAdminEvents: [], 
};

/**
 * Creates a Redux slice to manage the state for events (matches, training sessions).
 */
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    // --- Reducers (Actions) ---

    /**
     * Sets the main list of all events (matches and training).
     */
    setAllEvents: (state, action) => {
      state.allEvents = action.payload;
    },

    /**
     * Sets the currently selected event, typically for a detail page.
     */
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },

    /**
     * Sets the list of events for an admin view.
     */
    setAllAdminEvents: (state, action) => {
      state.allAdminEvents = action.payload;
    },
    
    /**
     * Stores the current search/filter query object.
     */
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },

    /**
     * Adds a newly created event to the beginning of the allEvents array.
     */
    addEvent: (state, action) => {
      state.allEvents.unshift(action.payload);
    },
  }
});

// --- Export Action Creators ---
// These are used in components to dispatch actions.
export const {
  setAllEvents,
  setSelectedEvent,
  setAllAdminEvents,
  setSearchedQuery,
  addEvent,
} = eventSlice.actions;

// --- Export Reducer ---
// This is added to the store configuration.
export default eventSlice.reducer;
