// src/services/api.ts

// Import Axios for making HTTP requests
import axios from 'axios';

// Import the ILocalItem type to annotate responses correctly
import { ILocalItem } from '../types/ILocalItem';

// Base URL of the backend API server
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Fetches all local items from the backend API.
 * 
 * @returns A promise that resolves to an array of ILocalItem objects.
 */
export const fetchLocalItems = async (): Promise<ILocalItem[]> => {
  // Send GET request to the /local-items endpoint
  const res = await axios.get(`${API_BASE_URL}/local-items`);

  // Return the response data (array of items)
  return res.data;
};
