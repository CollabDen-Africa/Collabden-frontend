import { useMutation } from '@tanstack/react-query';
import authService, { LoginPayload } from '@/services/auth.service';
import { handleApiError } from '@/lib/error-handler';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onError: (error) => handleApiError(error),
  });
};
