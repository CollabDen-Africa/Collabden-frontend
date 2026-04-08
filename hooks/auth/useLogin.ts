import { useMutation } from '@tanstack/react-query';
import { LoginPayload } from '@/services/auth.service';
import axios from 'axios';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      // Calling the absolute API proxy route for secure cookies
      const response = await axios.post('/api/auth/login', data);
      return response.data;
    },
  });
};
