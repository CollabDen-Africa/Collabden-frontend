import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import connectionService from '@/services/connection.service';
import { handleApiError } from '@/lib/error-handler';
import type { ConnectionRequestPayload, RespondConnectionPayload } from '@/types/api.types';

export const useConnections = () => {
  const queryClient = useQueryClient();

  // 1. Query to fetch all accepted user connections
  const useUserConnections = () => useQuery({
    queryKey: ['connections', 'list'],
    queryFn: () => connectionService.getConnections(),
  });

  // 2. Query to fetch all pending connection requests
  const usePendingRequests = () => useQuery({
    queryKey: ['connections', 'pending'],
    queryFn: () => connectionService.getPendingRequests(),
  });

  // 3. Mutation to send a connection request
  const useSendConnectionRequest = () => useMutation({
    mutationFn: (data: ConnectionRequestPayload) => connectionService.sendRequest(data),
    onSuccess: () => {
      // Invalidate both to refresh state immediately
      queryClient.invalidateQueries({ queryKey: ['connections', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['connections', 'list'] });
    },
    onError: (error) => handleApiError(error),
  });

  // 4. Mutation to respond (Accept/Reject) to a connection request
  const useRespondToConnectionRequest = () => useMutation({
    mutationFn: ({ id, data }: { id: string; data: RespondConnectionPayload }) =>
      connectionService.respondToRequest(id, data),
    onSuccess: () => {
      // Invalidate both lists so accepted connections and pending ones refresh automatically
      queryClient.invalidateQueries({ queryKey: ['connections', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['connections', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => handleApiError(error),
  });

  return {
    useUserConnections,
    usePendingRequests,
    useSendConnectionRequest,
    useRespondToConnectionRequest,
  };
};
