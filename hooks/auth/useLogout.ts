import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/auth/logout');
      return response.data;
    },
    onSuccess: () => {
      // Clear all queries on logout to ensure no data leaks
      queryClient.clear();
    },
  });
};
