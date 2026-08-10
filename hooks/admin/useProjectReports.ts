import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useProjectReports = (params: any) => {
  return useQuery({
    queryKey: ['adminProjectReports', params],
    queryFn: async () => {
      const response = await axios.get('/api/admin/projects/reports', { params });
      return response.data;
    },
  });
};

export const useUpdateProjectReportStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, reportId, status }: { projectId: string; reportId: string; status: string }) => {
      const response = await axios.patch('/api/admin/projects/reports/status', {
        projectId,
        reportId,
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjectReports'] });
    },
  });
};
