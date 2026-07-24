import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseUserActivityParams {
  id: string;
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

export const useUserActivity = ({ id, page = 1, limit = 10, search, type }: UseUserActivityParams) => {
  return useQuery({
    queryKey: ['adminUserActivity', id, page, limit, search, type],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (type && type !== 'All') params.append('type', type);

      const response = await axios.get(`/api/admin/users/${id}/activity?${params.toString()}`);
      return response.data;
    },
    enabled: !!id,
  });
};
