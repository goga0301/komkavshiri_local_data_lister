// src/services/api.ts
import axios from 'axios';
import { ILocalItem } from '../types/ILocalItem';

const API_BASE_URL = 'http://localhost:3001/api';

export const fetchLocalItems = async (): Promise<ILocalItem[]> => {
  const res = await axios.get(`${API_BASE_URL}/local-items`);
  return res.data;
};
