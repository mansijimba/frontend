import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// Replace this with your actual API endpoint
const registerUser = async (userData) => {
  const response = await axios.post('/api/register', userData);
  return response.data;
};

export function useRegisterUser() {
  return useMutation({
    mutationFn: registerUser,
  });
}