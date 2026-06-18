import { useMutation } from '@tanstack/react-query';
import authService, { VerifyPayload } from '@/services/auth.service';
import { handleApiError } from '@/lib/error-handler';

/**
 * Hook for email verification using TanStack Query
 * Handles loading and error states for the verification flow
 */
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: VerifyPayload) => authService.verifyEmail(data),
    onError: (error) => handleApiError(error),
  });
};

/**
 * Hook for resending verification code
 */
export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
    onError: (error) => handleApiError(error),
  });
};
