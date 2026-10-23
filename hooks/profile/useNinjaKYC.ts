import { useMutation } from '@tanstack/react-query';
import ninjaKycService from '@/services/ninja-kyc.service';
import { handleApiError } from '@/lib/error-handler';
import type { NinjaKYCInput } from '@/lib/validations/kyc.schema';

export const useNinjaKYC = () =>
  useMutation({
    mutationFn: (data: NinjaKYCInput) => ninjaKycService.identify(data),
    onError: (error) => handleApiError(error),
  });
