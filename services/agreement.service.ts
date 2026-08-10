import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { LegalAgreement } from "@/types/api.types";

const agreementService = {
  /**
   * List all agreements for the authenticated user across all projects.
   */
  getUserAgreements: async (): Promise<LegalAgreement[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_USERS.ALL_USERS + "/agreements");
    const raw = response.data;
    if (raw?.data && Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  },

  /**
   * List all agreement documents for a project.
   */
  getAgreements: async (projectId: string): Promise<LegalAgreement[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.AGREEMENTS.LIST(projectId));
    const raw = response.data;
    if (raw?.agreements && Array.isArray(raw.agreements)) return raw.agreements;
    if (raw?.data && Array.isArray(raw.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  },

  /**
   * Upload a new draft agreement document (PDF).
   */
  uploadDraft: async (projectId: string, formData: FormData): Promise<LegalAgreement> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AGREEMENTS.UPLOAD(projectId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const raw = response.data;
    return raw?.agreement || raw?.data || (raw as LegalAgreement);
  },

  /**
   * Edit or replace an agreement document before it is signed.
   */
  update: async (projectId: string, agreementId: string, formData: FormData): Promise<LegalAgreement> => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.AGREEMENTS.UPDATE(projectId, agreementId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const raw = response.data;
    return raw?.agreement || raw?.data || (raw as LegalAgreement);
  },

  /**
   * Update an agreement's status manually.
   */
  updateStatus: async (projectId: string, agreementId: string, status: "PENDING_SIGNATURE" | "SIGNED"): Promise<LegalAgreement> => {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.AGREEMENTS.STATUS(projectId, agreementId),
      { status }
    );
    const raw = response.data;
    return raw?.agreement || raw?.data || (raw as LegalAgreement);
  },

  /**
   * Upload a signed agreement document copy manually.
   */
  uploadSignedCopy: async (projectId: string, agreementId: string, formData: FormData): Promise<LegalAgreement> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AGREEMENTS.SIGN(projectId, agreementId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const raw = response.data;
    return raw?.agreement || raw?.data || (raw as LegalAgreement);
  },

  /**
   * Electronically sign an agreement directly on the platform.
   */
  esign: async (projectId: string, agreementId: string, intentToSign: boolean): Promise<LegalAgreement> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AGREEMENTS.ESIGN(projectId, agreementId),
      { intentToSign }
    );
    const raw = response.data;
    return raw?.agreement || raw?.data || (raw as LegalAgreement);
  },
};

export default agreementService;
