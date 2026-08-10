import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useProjectActivity = (params: { id: string; page?: number; limit?: number; search?: string; type?: string }) => {
  const { id, ...queryParams } = params;
  return useQuery({
    queryKey: ['adminProjectActivity', id, queryParams],
    queryFn: async () => {
      const response = await axios.get(`/api/admin/projects/${id}/activity`, { params: queryParams });
      return response.data;
    },
    enabled: !!id,
  });
};
