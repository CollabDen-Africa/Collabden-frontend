import { useMutation } from '@tanstack/react-query';
import authService, { AdminResend2FAPayload } from '@/services/auth.service';
import { handleApiError } from '@/lib/error-handler';

export const useAdminResend2FA = () => {
  return useMutation({
    mutationFn: (data: AdminResend2FAPayload) => authService.adminResend2FA(data),
    onError: (error) => handleApiError(error),
  });
};
