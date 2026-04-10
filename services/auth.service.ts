import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export interface SignupPayload {
  email: string;
  password?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface VerifyPayload {
  email: string;
  code: string;
}

export interface ResetPasswordPayload {
  password?: string;
  token?: string;
}

const authService = {
  /**
   * Register a new user
   * @param data { email, password }
   */
  signup: async (data: SignupPayload) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, payload);
    return response.data;
  },

  /**
   * Login a user
   * (Standard login, but we'll use a proxy route for HTTP-only cookies in practice)
   */
  login: async (data: LoginPayload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  /**
   * Verify user email via OTP/code
   */
  verifyEmail: async (data: VerifyPayload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY, data);
    return response.data;
  },

  /**
   * Request password reset link
   */
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },
};

export default authService;
