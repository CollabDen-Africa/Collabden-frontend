import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface UseUserNotesParams {
  id: string;
  page?: number;
  limit?: number;
}

export const useUserNotes = ({ id, page = 1, limit = 10 }: UseUserNotesParams) => {
  return useQuery({
    queryKey: ['adminUserNotes', id, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      const response = await axios.get(`/api/admin/users/${id}/notes?${params.toString()}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useAddUserNote = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, adminId }: { content: string, adminId: string }) => {
      const response = await axios.post(`/api/admin/users/${userId}/notes`, { content, adminId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUserNotes', userId] });
    },
  });
};
