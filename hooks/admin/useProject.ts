import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['adminProject', id],
    queryFn: async () => {
      const response = await axios.get(`/api/admin/projects/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
