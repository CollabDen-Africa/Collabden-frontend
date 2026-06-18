import { useMutation } from '@tanstack/react-query';
import authService from '@/services/auth.service';
import { handleApiError } from '@/lib/error-handler';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onError: (error) => handleApiError(error),
  });
};
