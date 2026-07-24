import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseUserAuditHistoryParams {
  id: string;
  page?: number;
  limit?: number;
}

export const useUserAuditHistory = ({ id, page = 1, limit = 10 }: UseUserAuditHistoryParams) => {
  return useQuery({
    queryKey: ['adminUserAuditHistory', id, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      const response = await axios.get(`/api/admin/users/${id}/audit-history?${params.toString()}`);
      return response.data;
    },
    enabled: !!id,
  });
};
