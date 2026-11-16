import { useMutation } from '@tanstack/react-query';
import authService, { VerifyPayload } from '@/services/auth.service';

/**
 * Hook for email verification using TanStack Query
 * Handles loading and error states for the verification flow
 */
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: VerifyPayload) => authService.verifyEmail(data),
    meta: { errorContext: 'auth.verifyEmail', toast: false },
  });
};

/**
 * Hook for resending verification code
 */
export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
    meta: { errorContext: 'auth.resendCode', toast: false },
  });
};
