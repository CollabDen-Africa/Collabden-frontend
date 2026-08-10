import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface UseProjectNotesParams {
  id: string;
  page?: number;
  limit?: number;
}

export const useProjectNotes = ({ id, page = 1, limit = 10 }: UseProjectNotesParams) => {
  return useQuery({
    queryKey: ['adminProjectNotes', id, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      const response = await axios.get(`/api/admin/projects/${id}/notes?${params.toString()}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useAddProjectNote = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const response = await axios.post(`/api/admin/projects/${projectId}/notes`, { content });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjectNotes', projectId] });
    },
  });
};
