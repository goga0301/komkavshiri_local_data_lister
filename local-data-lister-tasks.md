# Local Data Lister - Project Tasks

## Task 1: Project Setup & Backend Structure (30 min)
**Description:** Initialize the project structure with separate folders for frontend and backend. Set up Node.js with TypeScript for the backend, including necessary dependencies and configuration files.

**Steps:**
- Create project folders: `local-data-lister/backend` and `local-data-lister/frontend`
- Initialize backend with `npm init` and install dependencies: `express`, `typescript`, `ts-node`, `@types/node`, `@types/express`, `cors`
- Create `tsconfig.json` for backend TypeScript configuration
- Set up basic Express server structure with a health check endpoint
- Create npm scripts for development (`npm run dev`)

**Deliverable:** Basic backend server running on port 3001 with TypeScript configured

---

## Task 2: Create Data Model & API Endpoint (30 min)
**Description:** Define TypeScript interfaces for local items (restaurants, parks, or events) and create a simple API endpoint that serves hardcoded/mock data.

**Steps:**
- Create TypeScript interface for local items (e.g., `ILocalItem` with properties like id, name, type, description, location, rating)
- Create mock data array with 10-15 sample items
- Implement GET endpoint `/api/local-items` that returns the mock data
- Add proper TypeScript types for request/response handling
- Test the endpoint using a tool like Postman or curl

**Deliverable:** Working API endpoint that returns typed JSON data

---

## Task 3: Frontend Setup with React & TypeScript (30 min)
**Description:** Initialize the React frontend with TypeScript and set up the basic project structure with necessary components and type definitions.

**Steps:**
- Create React app with TypeScript template: `npx create-react-app frontend --template typescript`
- Install additional dependencies if needed (axios for API calls)
- Create folder structure: `components/`, `types/`, `services/`
- Create the same `ILocalItem` interface in frontend
- Set up basic App component with initial styling
- Configure proxy in package.json to connect to backend

**Deliverable:** React app running with TypeScript, connected to backend

---

## Task 4: Implement Data Fetching & Display (30 min)
**Description:** Create React components to fetch data from the backend API and display it in a clean, organized list format.

**Steps:**
- Create `apiService.ts` with async function to fetch local items
- Implement `LocalItemList` component with proper TypeScript props
- Use React hooks (useState, useEffect) to fetch and store data
- Create `LocalItemCard` component to display individual items
- Add basic CSS styling for the list and cards
- Handle loading and error states

**Deliverable:** Frontend displaying the list of local items fetched from backend

---

## Task 5: Add Search/Filter Functionality (30 min)
**Description:** Implement a search bar that allows users to filter the displayed list based on keywords, completing the full-stack application.

**Steps:**
- Create `SearchBar` component with TypeScript props
- Implement controlled input with useState
- Add filter logic to filter items by name, type, or description
- Update the list display to show only filtered items
- Add debouncing for better performance (optional if time permits)
- Style the search bar and ensure responsive design

**Deliverable:** Fully functional application with search/filter capability

---

## Bonus Considerations (if time permits in any task):
- Add unit tests for at least one component
- Implement sorting functionality (by name, rating, etc.)
- Add more detailed TypeScript types (enums for item types)
- Create a simple loading spinner component
- Add error boundary for better error handling
