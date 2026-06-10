import { useMutation } from '@tanstack/react-query';
import waitlistService from '@/services/waitlist.service';
import { handleApiError } from '@/lib/error-handler';

export const useWaitlist = () => {
  const useJoinWaitlist = () => useMutation({
    mutationFn: (email: string) => waitlistService.join(email),
    onError: (error) => handleApiError(error),
  });

  return {
    useJoinWaitlist,
  };
};
