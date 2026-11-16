import { useMutation } from '@tanstack/react-query';
import authService, { LoginPayload } from '@/services/auth.service';


export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    meta: { errorContext: 'auth.login', toast: false },
  });
};
