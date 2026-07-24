import { useMutation } from '@tanstack/react-query';
import authService, { AdminVerify2FAPayload } from '@/services/auth.service';
import { handleApiError } from '@/lib/error-handler';

export const useAdminVerify2FA = () => {
  return useMutation({
    mutationFn: (data: AdminVerify2FAPayload) => authService.adminVerify2FA(data),
    onError: (error) => handleApiError(error),
  });
};
