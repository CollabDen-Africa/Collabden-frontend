import { useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';

export const useUpdateOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { hasCompletedOnboarding: boolean }) => authService.updateOnboarding(data),
    onSuccess: () => {
      // Invalidate profile to reflect onboarding completion
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    meta: { errorContext: 'onboarding.update' },
  });
};
