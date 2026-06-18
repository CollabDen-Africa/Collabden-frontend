import { useMutation } from '@tanstack/react-query';
import waitlistService from '@/services/waitlist.service';
import { handleApiError } from '@/lib/error-handler';
import { JoinWaitlistPayload } from '@/types/api.types';

export const useWaitlist = () => {
  const useJoinWaitlist = () => useMutation({
    mutationFn: (payload: JoinWaitlistPayload) => waitlistService.join(payload),
    onError: (error) => handleApiError(error),
  });

  return {
    useJoinWaitlist,
  };
};
