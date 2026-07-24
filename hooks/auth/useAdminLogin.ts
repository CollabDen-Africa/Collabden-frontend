import { useMutation } from '@tanstack/react-query';
import authService, { LoginPayload } from '@/services/auth.service';
import { handleApiError } from '@/lib/error-handler';

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => authService.adminLogin(data),
    onError: (error) => handleApiError(error),
  });
};
