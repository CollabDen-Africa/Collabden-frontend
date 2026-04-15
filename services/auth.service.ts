import axiosInstance from "@/lib/axios";
import axios from "axios";
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
   * Register a new user
   * @param data { email, password }
   */
  signup: async (data: SignupPayload) => {
    const payload = {
      email: data.email,
      password: data.password,
    };

    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.SIGNUP,
      payload,
    );
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
   * Get current user profile via local proxy
   */
  getProfile: async () => {
    // Calling local proxy to use HTTP-only cookies
    const response = await axios.get('/api/auth/profile');
    return response.data;
  },

  /**
   * Verify user email via OTP/code
   */
  verifyEmail: async (data: VerifyPayload) => {
    if (!data.email) {
      throw new Error("Email is required for verification.");
    }
    try {
      const payload = {
        email: data.email.trim(),
        verificationToken: data.verificationToken,
      };
      const response = await axiosInstance.post(
        API_ENDPOINTS.AUTH.VERIFY,
        payload,
      );
      return response.data;
    } catch (err: unknown) {
      let backendMessage = "Verification failed. Please check the code.";
      if (axios.isAxiosError(err)) {
        backendMessage = err.response?.data?.message || err.response?.data?.error || backendMessage;
      }
      throw new Error(backendMessage);
    }
  },

  /**
     * Resend verification email
     */
  resendVerification: async (email: string) => {
    if (!email) {
      throw new Error("Email is required to resend verification code.");
    }
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.AUTH.RESEND_VERIFY,
        { email: email.trim() },
      );
      return response.data;
    } catch (err: unknown) {
      let backendMessage = "Failed to resend code.";
      if (axios.isAxiosError(err)) {
        backendMessage = err.response?.data?.message || err.response?.data?.error || backendMessage;
      }
      throw new Error(backendMessage);
    }
  },

  /**
 * Request password reset link
 */
  forgotPassword: async (email: string) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
    );
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordPayload) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data,
    );
    return response.data;
  },
};

export default authService;
