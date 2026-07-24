import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseUserReportsParams {
  id: string;
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

export const useUserReports = ({ id, page = 1, limit = 10, search, type }: UseUserReportsParams) => {
  return useQuery({
    queryKey: ['adminUserReports', id, page, limit, search, type],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (type && type !== 'All') params.append('type', type);

      const response = await axios.get(`/api/admin/users/${id}/reports?${params.toString()}`);
      return response.data;
    },
    enabled: !!id,
  });
};
