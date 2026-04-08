import { useMutation } from '@tanstack/react-query';
import authService, { SignupPayload } from '@/services/auth.service';

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupPayload) => authService.signup(data),
  });
};
