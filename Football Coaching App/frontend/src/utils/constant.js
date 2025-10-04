// This file contains the base URLs for all backend API endpoints.

// Base URL for the server
const API_BASE_URL = "http://localhost:5001/api/v1";

// --- Authentication Endpoint ---
// Used for user registration, login, and managing user sessions.
export const AUTH_API_END_POINT = `${API_BASE_URL}/user`;

// --- Player Endpoint ---
// Used for all actions related to players (e.g., fetching roster, adding/editing players).
export const PLAYER_API_END_POINT = `${API_BASE_URL}/player`;

// --- Event Endpoint ---
// Used for creating, reading, updating, and deleting events (matches and training).
export const EVENT_API_END_POINT = `${API_BASE_URL}/event`;

// --- Game Plan / Activity Endpoint ---
// Used for managing tactical game plans and the library of training activities.
export const PLAN_API_END_POINT = `${API_BASE_URL}/plan`;

// --- Attendance Endpoint ---
// Used for players to mark their availability for upcoming events.
export const ATTENDANCE_API_END_POINT = `${API_BASE_URL}/attendance`;
// --- Team Stats Endpoint ---
// Used for fetching and updating team statistics.
export const STATS_API_END_POINT = `${API_BASE_URL}/stats`;
