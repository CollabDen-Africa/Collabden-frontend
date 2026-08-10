import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { TwoFactorSetupResponse } from "@/types/api.types";

const securityService = {
  /**
   * Set up 2FA: generates secret and QR code URL.
   */
  setup2FA: async (): Promise<TwoFactorSetupResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.SECURITY.SETUP_2FA);
    return response.data?.data || response.data;
  },

  /**
   * Verify token and enable 2FA.
   */
  verify2FA: async (token: string): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.SECURITY.VERIFY_2FA, { token });
    return response.data?.data || response.data;
  },

  /**
   * Terminate all other active sessions for user.
   */
  logoutAllDevices: async (): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.SECURITY.LOGOUT_ALL);
    return response.data?.data || response.data;
  },

  /**
   * Deactivate account.
   */
  deactivateAccount: async (): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.SECURITY.DEACTIVATE);
    return response.data?.data || response.data;
  },

  /**
   * Delete account.
   */
  deleteAccount: async (): Promise<any> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.SECURITY.DELETE);
    return response.data?.data || response.data;
  },

  /**
   * Request data export.
   */
  requestDataExport: async (): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.SECURITY.DATA_EXPORT);
    return response.data?.data || response.data;
  },

  /**
   * Check status of export request.
   */
  checkDataExportStatus: async (id: string): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SECURITY.EXPORT_STATUS(id));
    return response.data?.data || response.data;
  },

  /**
   * Create support request ticket.
   */
  createSupportTicket: async (subject: string, message: string): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.SECURITY.SUPPORT, {
      subject,
      message,
    });
    return response.data?.data || response.data;
  },
};

export default securityService;
