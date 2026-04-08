
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://collabden-backend.onrender.com';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/v1/user/signup`,
    LOGIN: `${API_BASE_URL}/api/v1/user/login`,
    PROFILE: `${API_BASE_URL}/api/v1/user/profile`,
    VERIFY: `${API_BASE_URL}/api/v1/user/verify`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/user/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/v1/user/reset-password`,
  },
};

export interface API_RESPONSE<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface USER_PROFILE {
  id: string;
  email: string;
  isVerified: boolean;
}
