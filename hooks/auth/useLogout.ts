import { useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries on logout to ensure no data leaks
      queryClient.clear();
    },
  });
};
