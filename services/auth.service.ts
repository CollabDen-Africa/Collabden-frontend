import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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

export interface AdminVerify2FAPayload {
  adminId: string;
  code: string;
}

export interface AdminResend2FAPayload {
  adminId: string;
}

const authService = {
  /**
   * Register a new user
   */
  signup: async (data: SignupPayload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, data);
    return response.data;
  },

  /**
   * Login a user
   */
  login: async (data: LoginPayload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  /**
   * Login an admin
   */
  adminLogin: async (data: LoginPayload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_AUTH.LOGIN, data);
    return response.data;
  },

  /**
   * Verify admin 2FA code
   */
  adminVerify2FA: async (data: AdminVerify2FAPayload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_AUTH.VERIFY_2FA, data);
    return response.data;
  },

  /**
   * Resend admin 2FA code
   */
  adminResend2FA: async (data: AdminResend2FAPayload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_AUTH.RESEND_2FA, data);
    return response.data;
  },

  /**
   * Admin forgot password request
   */
  adminForgotPassword: async (email: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  /**
   * Admin reset password
   */
  adminResetPassword: async (data: { resetToken: string; newPassword: string }) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  /**
   * Logout user / admin
   */
  logout: async () => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_AUTH.ME.replace('/me', '/logout'));
      return response.data;
    } catch {
      return { success: true };
    }
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
    if (!data.email) {
      throw new Error("Email is required for verification.");
    }
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.VERIFY,
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
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.RESEND_VERIFY,
      { email: email.trim() }
    );
    return response.data;
  },

  /**
   * Request password reset link
   */
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data;
  },

  /**
   * Update user onboarding status
   */
  updateOnboarding: async (data: { hasCompletedOnboarding: boolean }) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.AUTH.ONBOARDING, {
      completed: data.hasCompletedOnboarding
    });
    return response.data;
  },
};

export default authService;
