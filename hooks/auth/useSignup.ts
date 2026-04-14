import { useMutation } from '@tanstack/react-query';
import { SignupPayload } from '@/services/auth.service';
import axios from 'axios';

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupPayload) => {
      const response = await axios.post('/api/auth/signup', data);
      return response.data;
    },
  });
};
