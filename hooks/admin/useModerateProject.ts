import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface ModerateProjectPayload {
  actionType: 'ARCHIVE' | 'REMOVE';
  reason: string;
  additionalNotes?: string;
  notifyOwner?: boolean;
}

export const useModerateProject = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ModerateProjectPayload) => {
      const response = await axios.post(`/api/admin/projects/${projectId}/moderate`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      queryClient.invalidateQueries({ queryKey: ['projectDetails', projectId] });
    },
  });
};
