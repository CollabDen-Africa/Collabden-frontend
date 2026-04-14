import { useMutation } from '@tanstack/react-query';
import authService, { VerifyPayload } from '@/services/auth.service';

/**
 * Hook for email verification using TanStack Query
 * Handles loading and error states for the verification flow
 */
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (data: VerifyPayload) => {
      return await authService.verifyEmail(data);
    },
  });
};

/**
 * Hook for resending verification code
 */
export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return await authService.resendVerification(email);
    },
  });
};
