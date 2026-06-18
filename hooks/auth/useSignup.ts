import { useMutation } from '@tanstack/react-query';
import authService, { SignupPayload } from '@/services/auth.service';
import { handleApiError } from '@/lib/error-handler';

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupPayload) => authService.signup(data),
    onError: (error) => handleApiError(error),
  });
};
