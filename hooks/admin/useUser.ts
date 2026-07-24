import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['adminUser', id],
    queryFn: async () => {
      const response = await axios.get(`/api/admin/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
