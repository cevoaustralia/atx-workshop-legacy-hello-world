import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { GreetingsList } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const fetchGreetings = async (): Promise<GreetingsList> => {
  const response = await axios.get<GreetingsList>(`${API_URL}/greetings.json`);
  return response.data;
};

export const useGetGreetingsQuery = () => {
  return useQuery({
    queryKey: ['greetings', 'list'],
    queryFn: fetchGreetings,
  });
};
