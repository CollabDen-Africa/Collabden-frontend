import { proxyAxios } from '@/lib/axios';
import { PROXY_ENDPOINTS } from '@/constants/api-endpoints';
import type { NinjaKYCInput } from '@/lib/validations/kyc.schema';

export interface NinjaKYCResponse {
  verified: boolean;
  attemptsRemaining?: number;
  retryAfter?: number;
  data?: Record<string, unknown>;
  message?: string;
}

export type NinjaKycErrorCode =
  | 'NIN_ALREADY_LINKED'
  | 'ALREADY_VERIFIED'
  | 'RATE_LIMITED'
  | 'DETAILS_MISMATCH'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN';

const ninjaKycService = {
  identify: (payload: NinjaKYCInput) =>
    proxyAxios.post<NinjaKYCResponse>(PROXY_ENDPOINTS.NINJA_KYC.IDENTIFY, payload),
};

export default ninjaKycService;
