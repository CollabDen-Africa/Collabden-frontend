import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UseProjectAuditHistoryParams {
  id: string;
  page?: number;
  limit?: number;
}

export const useProjectAuditHistory = ({ id, page = 1, limit = 10 }: UseProjectAuditHistoryParams) => {
  return useQuery({
    queryKey: ['adminProjectAuditHistory', id, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      const response = await axios.get(`/api/admin/projects/${id}/audit?${params.toString()}`);
      return response.data;
    },
    enabled: !!id,
  });
};
