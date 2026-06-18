import { useMutation } from '@tanstack/react-query';
import authService, { ResetPasswordPayload } from '@/services/auth.service';
import { handleApiError } from '@/lib/error-handler';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => authService.resetPassword(data),
    onError: (error) => handleApiError(error),
  });
};
