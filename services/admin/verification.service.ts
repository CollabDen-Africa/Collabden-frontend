import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface VerificationParams {
  search?: string;
  status?: string;
  verificationType?: string;
  submissionDateFrom?: string;
  submissionDateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface VerificationDecisionPayload {
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export const getVerificationRequests = async (params?: VerificationParams) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_VERIFICATION.LIST, { params });
  return response.data;
};

export const getVerificationAuditHistory = async (params?: { search?: string; page?: number; limit?: number }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_VERIFICATION.AUDIT, { params });
  return response.data;
};

export const getUserVerificationHistory = async (userId: string, params?: { status?: string; page?: number; limit?: number }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_VERIFICATION.USER_HISTORY(userId), { params });
  return response.data;
};

export const getVerificationDetails = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_VERIFICATION.DETAIL(id));
  return response.data;
};

export const processVerificationDecision = async (id: string, payload: VerificationDecisionPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_VERIFICATION.DECISION(id), payload);
  return response.data;
};

export const verificationService = {
  getVerificationRequests,
  getVerificationAuditHistory,
  getUserVerificationHistory,
  getVerificationDetails,
  processVerificationDecision,
};

export default verificationService;
