import axiosInstance, { localApi } from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface SignupPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyPayload {
  email: string;
  verificationToken: string;
}

export interface ResetPasswordPayload {
  password: string;
  token: string;
}

const authService = {
  /**
   * Register a new user via local API route
   * @param data { email, password }
   */
  signup: async (data: SignupPayload) => {
    const response = await localApi.post('/api/auth/signup', data);
    return response.data;
  },

  /**
   * Login a user via local API route
   */
  login: async (data: LoginPayload) => {
    const response = await localApi.post('/api/auth/login', data);
    return response.data;
  },

  /**
   * Logout a user via local API route
   */
  logout: async () => {
    const response = await localApi.post('/api/auth/logout');
    return response.data;
  },

  /**
   * Get current user profile via local proxy
   */
  getProfile: async () => {
    const response = await localApi.get('/api/auth/profile');
    return response.data;
  },

  /**
   * Verify user email via OTP/code
   */
  verifyEmail: async (data: VerifyPayload) => {
    if (!data.email) {
      throw new Error("Email is required for verification.");
    }
    const response = await localApi.post(
      '/api/auth/verify',
      {
        email: data.email.trim(),
        verificationToken: data.verificationToken,
      }
    );
    return response.data;
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string) => {
    if (!email) {
      throw new Error("Email is required to resend verification code.");
    }
    const response = await localApi.post(
      '/api/auth/resend-verify',
      { email: email.trim() }
    );
    return response.data;
  },

  /**
   * Request password reset link
   */
  forgotPassword: async (email: string) => {
    const response = await localApi.post(
      '/api/auth/forgot-password',
      { email }
    );
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await localApi.post(
      '/api/auth/reset-password',
      data
    );
    return response.data;
  },

  /**
   * Update user onboarding status
   */
  updateOnboarding: async (data: { hasCompletedOnboarding: boolean }) => {
    const response = await localApi.patch('/api/proxy/user/onboarding', {
      completed: data.hasCompletedOnboarding
    });
    return response.data;
  },
};

export default authService;
