# AI Coding Agent Instructions for TactAIc

Welcome to the TactAIc codebase! This document provides essential guidelines for AI coding agents to be productive in this project. TactAIc is a MERN-stack application designed to assist football coaches with tactical planning and team management. Below are the key architectural insights, workflows, and conventions to follow.

## Project Overview
- **Frontend**: Built with React, Vite, and Tailwind CSS. The frontend resides in the `frontend/` directory and includes reusable components, hooks, and Redux slices for state management.
- **Backend**: A Node.js and Express.js server located in the `backend/` directory. It handles API routes, middleware, and database interactions.
- **Database**: MongoDB is used for data storage, with models defined in the `backend/models/` directory.

## Key Directories and Files
- **Frontend**:
  - `src/components/`: Contains reusable UI components and feature-specific components.
  - `src/redux/`: Houses Redux slices for managing application state.
  - `src/hooks/`: Custom React hooks for data fetching and other utilities.
  - `vite.config.js`: Configuration for the Vite build tool.
- **Backend**:
  - `controllers/`: Defines the logic for handling API requests.
  - `routes/`: Maps API endpoints to their respective controllers.
  - `models/`: Contains Mongoose schemas for MongoDB collections.
  - `utils/db.js`: Handles database connection setup.

## Developer Workflows
### Setting Up the Project
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the backend server:
   ```bash
   cd backend
   node index.js
   ```
3. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

### Seeding the Database
- Use the `seed.js` script in the `backend/` directory to populate the database with initial data:
  ```bash
  node seed.js
  ```

### Building the Frontend
- Run the following command to build the frontend for production:
  ```bash
  npm run build
  ```

## Project-Specific Conventions
- **Component Organization**: Components are grouped by feature (e.g., `auth/`, `events/`, `Team/`). Shared components are in `shared/`.
- **API Communication**: Use `fetch` or `axios` for API calls. Backend endpoints are defined in `backend/routes/`.
- **Styling**: Tailwind CSS is used for styling. Avoid inline styles unless necessary.
- **State Management**: Use Redux for global state. Local state should be managed within components where possible.

## Integration Points
- **Cloudinary**: Used for image uploads. Configuration is in `backend/utils/cloudinary.js`.
- **Authentication**: Middleware for authentication is in `backend/middlewares/auth.middleware.js`.
- **Event Handling**: Event-related logic is centralized in `backend/controllers/event.controller.js` and `frontend/src/hooks/useGetAllEvents.js`.

## Testing and Debugging
- **Backend**: Use `console.log` for debugging or integrate a Node.js debugger.
- **Frontend**: Use browser developer tools and React DevTools.
- **Database**: Use MongoDB Compass or the Mongo shell for inspecting data.

## Examples
### Adding a New API Endpoint
1. Create a new controller in `backend/controllers/`.
2. Define the route in `backend/routes/`.
3. Test the endpoint using Postman or a similar tool.

### Creating a New Component
1. Add the component to the appropriate directory in `frontend/src/components/`.
2. Import and use the component in the relevant parent component.
3. Style the component using Tailwind CSS.

---

For any unclear or incomplete sections, please provide feedback to iterate and improve this document.