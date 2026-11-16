import { useMutation } from '@tanstack/react-query';
import authService, { ResetPasswordPayload } from '@/services/auth.service';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordPayload) => authService.resetPassword(data),
    meta: { errorContext: 'auth.resetPassword', toast: false },
  });
};
