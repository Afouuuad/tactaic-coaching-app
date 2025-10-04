import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// --- Import the new reducers for the Football Coaching App ---
import authReducer from "./authSlice";
import eventReducer from "./eventSlice";    // Changed from jobReducer
import playerReducer from "./playerSlice";  // Added for team roster
import planReducer from "./planSlice";      // Added for game plans/activities (replaces favoriteSlice)


// --- Combine the new reducers into a single rootReducer ---
// The keys here define the names of your state slices (e.g., state.event)
const rootReducer = combineReducers({
  auth: authReducer,
  event: eventReducer,    // Renamed from 'job'
  player: playerReducer,  // Added 'player' state
  plan: planReducer,      // Added 'plan' state (replaces 'favorites')
});

// --- Redux Persist Configuration (no changes needed here) ---
const persistConfig = {
  key: "football-coach-app", // Changed key for clarity
  version: 1,
  storage,
  // You can choose to blacklist certain states from being persisted if needed
  // blacklist: ['player'] 
};

// --- Create the persisted reducer ---
const persistedReducer = persistReducer(persistConfig, rootReducer);

// --- Configure and create the store ---
// This uses the persisted reducer and sets up middleware to ignore redux-persist actions.
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
