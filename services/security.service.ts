import { localApi } from "@/lib/axios";
import type { TwoFactorSetupResponse } from "@/types/api.types";

const securityService = {
  /**
   * Set up 2FA: generates secret and QR code URL.
   */
  setup2FA: async (): Promise<TwoFactorSetupResponse> => {
    const response = await localApi.post("/api/proxy/user/security/2fa/setup");
    return response.data;
  },

  /**
   * Verify token and enable 2FA.
   */
  verify2FA: async (token: string): Promise<any> => {
    const response = await localApi.post("/api/proxy/user/security/2fa/verify", { token });
    return response.data;
  },

  /**
   * Terminate all other active sessions for user.
   */
  logoutAllDevices: async (): Promise<any> => {
    const response = await localApi.post("/api/proxy/user/security/logout-all");
    return response.data;
  },

  /**
   * Deactivate account.
   */
  deactivateAccount: async (): Promise<any> => {
    const response = await localApi.post("/api/proxy/user/security/deactivate");
    return response.data;
  },

  /**
   * Delete account.
   */
  deleteAccount: async (): Promise<any> => {
    const response = await localApi.delete("/api/proxy/user/security/delete");
    return response.data;
  },

  /**
   * Request data export.
   */
  requestDataExport: async (): Promise<any> => {
    const response = await localApi.post("/api/proxy/user/security/data-export");
    return response.data;
  },

  /**
   * Check status of export request.
   */
  checkDataExportStatus: async (id: string): Promise<any> => {
    const response = await localApi.get(`/api/proxy/user/security/data-export/${id}`);
    return response.data;
  },

  /**
   * Create support request ticket.
   */
  createSupportTicket: async (subject: string, message: string): Promise<any> => {
    const response = await localApi.post("/api/proxy/user/security/support-request", {
      subject,
      message,
    });
    return response.data;
  },
};

export default securityService;
