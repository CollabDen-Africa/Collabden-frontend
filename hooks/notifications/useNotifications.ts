import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationService from '@/services/notification.service';
import { handleApiError } from '@/lib/error-handler';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Fetch all notifications
  const useAllNotifications = () => useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getAll(),
    refetchInterval: 60000, // Poll every minute
  });

  // Mark all as read
  const useMarkAllRead = () => useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => handleApiError(error),
  });

  // Mark single as read
  const useMarkOneRead = () => useMutation({
    mutationFn: (id: string) => notificationService.markOneRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => handleApiError(error),
  });

  return {
    useAllNotifications,
    useMarkAllRead,
    useMarkOneRead,
  };
};
