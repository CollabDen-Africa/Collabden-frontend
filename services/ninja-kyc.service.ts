import { proxyAxios } from '@/lib/axios';
import { PROXY_ENDPOINTS } from '@/constants/api-endpoints';
import type { NinjaKYCInput } from '@/lib/validations/kyc.schema';

export interface NinjaKYCResponse {
  verified: boolean;
  data?: Record<string, unknown>;
  message?: string;
}

const ninjaKycService = {
  identify: (payload: NinjaKYCInput) =>
    proxyAxios.post<NinjaKYCResponse>(PROXY_ENDPOINTS.NINJA_KYC.IDENTIFY, payload),
};

export default ninjaKycService;
