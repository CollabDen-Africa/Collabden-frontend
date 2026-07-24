import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { UsersParams } from '@/services/adminUsers.service';

export const useUsers = (params: UsersParams) => {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: async () => {
      const response = await axios.get('/api/admin/users', { params });
      return response.data;
    },
  });
};
