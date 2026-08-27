import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type VerificationType = "Selfie + ID" | "Identity Document" | "Artist Portfolio" | "Business Reg.";
export type VerificationStatus = "Pending" | "Under Review" | "Approved" | "Rejected" | "Incomplete" | "Expired";

export interface VerificationItem {
  id: string;
  requestId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  type: VerificationType;
  status: VerificationStatus;
  attempts: number;
  assignedAdmin?: string;
  submittedDate: string;
}

export interface VerificationDetailData extends VerificationItem {
  location: string;
  accountType: string;
  memberSince: string;
  idType: string;
  idNumber: string;
  idExpiryDate: string;
  documentFrontUrl?: string;
  documentBackUrl?: string;
  selfieUrl?: string;
  verificationChecks: {
    faceMatchScore: number;
    documentValidity: boolean;
    ocrNameMatch: boolean;
  };
  adminNotes?: string;
}

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
  adminNotes?: string;
}

export interface VerificationStats {
  totalRequests: number;
  pendingReview: number;
  underReview: number;
  approved: number;
  rejected: number;
  expiredIncomplete: number;
}

export const getVerificationRequests = async (params?: VerificationParams) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_VERIFICATION.LIST, { params });
  return response.data;
};

export const getVerificationStats = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_VERIFICATION.STATS);
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

export const assignVerification = async (id: string, adminId: string) => {
  const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN_VERIFICATION.ASSIGN(id), { adminId });
  return response.data;
};

export const getUserVerificationHistory = async (userId: string, params?: { status?: string; page?: number; limit?: number }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_VERIFICATION.USER_HISTORY(userId), { params });
  return response.data;
};

export const getVerificationAuditHistory = async (params?: { search?: string; page?: number; limit?: number }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_VERIFICATION.AUDIT, { params });
  return response.data;
};

export const verificationService = {
  getVerificationRequests,
  getVerificationStats,
  getVerificationDetails,
  processVerificationDecision,
  assignVerification,
  getUserVerificationHistory,
  getVerificationAuditHistory,
};

export default verificationService;
