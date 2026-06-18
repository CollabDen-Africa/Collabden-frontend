import { localApi } from "@/lib/axios";
import type { LegalAgreement } from "@/types/api.types";

const agreementService = {
  /**
   * List all agreement documents for a project.
   */
  getAgreements: async (projectId: string): Promise<LegalAgreement[]> => {
    const response = await localApi.get(`/api/proxy/projects/${projectId}/agreements`);
    const raw = response.data;
    if (raw?.agreements && Array.isArray(raw.agreements)) return raw.agreements;
    if (Array.isArray(raw)) return raw;
    return [];
  },

  /**
   * Upload a new draft agreement document (PDF).
   */
  uploadDraft: async (projectId: string, formData: FormData): Promise<LegalAgreement> => {
    const response = await localApi.post(
      `/api/proxy/projects/${projectId}/agreements`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const raw = response.data;
    return raw?.agreement || (raw as LegalAgreement);
  },

  /**
   * Edit or replace an agreement document before it is signed.
   */
  update: async (projectId: string, agreementId: string, formData: FormData): Promise<LegalAgreement> => {
    const response = await localApi.put(
      `/api/proxy/projects/${projectId}/agreements/${agreementId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const raw = response.data;
    return raw?.agreement || (raw as LegalAgreement);
  },

  /**
   * Update an agreement's status manually (e.g. from DRAFT to PENDING_SIGNATURE).
   */
  updateStatus: async (projectId: string, agreementId: string, status: "PENDING_SIGNATURE" | "SIGNED"): Promise<LegalAgreement> => {
    const response = await localApi.patch(
      `/api/proxy/projects/${projectId}/agreements/${agreementId}/status`,
      { status }
    );
    const raw = response.data;
    return raw?.agreement || (raw as LegalAgreement);
  },

  /**
   * Upload a signed agreement document copy manually.
   */
  uploadSignedCopy: async (projectId: string, agreementId: string, formData: FormData): Promise<LegalAgreement> => {
    const response = await localApi.post(
      `/api/proxy/projects/${projectId}/agreements/${agreementId}/sign`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const raw = response.data;
    return raw?.agreement || (raw as LegalAgreement);
  },

  /**
   * Electronically sign an agreement directly on the platform.
   */
  esign: async (projectId: string, agreementId: string, intentToSign: boolean): Promise<LegalAgreement> => {
    const response = await localApi.post(
      `/api/proxy/projects/${projectId}/agreements/${agreementId}/esign`,
      { intentToSign }
    );
    const raw = response.data;
    return raw?.agreement || (raw as LegalAgreement);
  },
};

export default agreementService;
