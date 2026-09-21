import axios from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

const ADMIN_VERIFICATION_PROXY = "/api/proxy/admin/verification";

const adminProxyGet = async <T>(path: string, params?: Record<string, unknown>): Promise<T> => {
  const response = await axios.get<T>(path, { params, withCredentials: true });
  return response.data;
};

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

const verificationTypeLabel = (type?: string): VerificationType => {
  if (type === "GOVERNMENT_ID") return "Identity Document";
  if (type === "SELFIE_AND_ID") return "Selfie + ID";
  if (type === "ARTIST_PORTFOLIO") return "Artist Portfolio";
  if (type === "BUSINESS_REGISTRATION") return "Business Reg.";
  return "Identity Document";
};

const verificationStatusLabel = (status?: string): VerificationStatus => {
  if (status === "APPROVED") return "Approved";
  if (status === "REJECTED") return "Rejected";
  if (status === "EXPIRED") return "Expired";
  if (status === "INCOMPLETE") return "Incomplete";
  if (status === "UNDER_REVIEW") return "Under Review";
  return "Pending";
};

const userName = (user: any): string =>
  user?.displayName || user?.legalName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Unknown user";

const mapVerification = (request: any): VerificationItem => ({
  id: request.id,
  requestId: request.id,
  userId: request.userId,
  userName: userName(request.user),
  userEmail: request.user?.email || "",
  userAvatar: request.user?.avatarUrl || undefined,
  type: verificationTypeLabel(request.verificationType),
  status: verificationStatusLabel(request.status),
  attempts: request.attempts || 1,
  assignedAdmin: request.reviewedBy?.email,
  submittedDate: request.createdAt
    ? new Date(request.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A",
});

export const getVerificationRequests = async (params?: VerificationParams) => {
  const verificationTypeFilters: Record<string, string> = {
    "Selfie + ID": "SELFIE_AND_ID",
    "Identity Document": "GOVERNMENT_ID",
    "Artist Portfolio": "ARTIST_PORTFOLIO",
    "Business Reg.": "BUSINESS_REGISTRATION",
  };
  const selectedStatus = params?.status;
  const normalizedParams = {
    ...params,
    // UNDER_REVIEW is displayed by the UI but is not a backend status enum.
    status: selectedStatus === "ALL" || selectedStatus === "Under Review"
      ? undefined
      : selectedStatus?.toUpperCase().replace(" ", "_"),
    verificationType: params?.verificationType === "ALL"
      ? undefined
      : verificationTypeFilters[params?.verificationType || ""] || params?.verificationType,
  };
  const response = await adminProxyGet<any>(ADMIN_VERIFICATION_PROXY, normalizedParams);
  const data = response?.data || response;
  const summary = data?.summary || {};

  return {
    requests: Array.isArray(data?.requests) ? data.requests.map(mapVerification) : [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    stats: {
      totalRequests: summary.totalRequests || 0,
      pendingReview: summary.pendingCount || 0,
      underReview: 0,
      approved: summary.approvedCount || 0,
      rejected: summary.rejectedCount || 0,
      expiredIncomplete: (summary.expiredCount || 0) + (summary.incompleteCount || 0),
    } satisfies VerificationStats,
  };
};

export const getVerificationStats = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_VERIFICATION.STATS);
  return response.data;
};

export const getVerificationDetails = async (id: string) => {
  const response = await adminProxyGet<any>(`${ADMIN_VERIFICATION_PROXY}/${id}`);
  const data = response?.data || response;
  const request = data?.request || data;
  return {
    ...mapVerification(request),
    location: request.user?.location || "",
    accountType: request.user?.accountType || "",
    memberSince: request.user?.createdAt ? new Date(request.user.createdAt).toLocaleDateString() : "",
    idType: request.verificationType || "",
    idNumber: request.idNumber || "",
    idExpiryDate: request.idExpiryDate || "",
    documentFrontUrl: request.documentFrontUrl,
    documentBackUrl: request.documentBackUrl,
    selfieUrl: request.selfieUrl,
    verificationChecks: request.verificationChecks || { faceMatchScore: 0, documentValidity: false, ocrNameMatch: false },
    adminNotes: request.rejectionReason,
  } satisfies VerificationDetailData;
};

export const processVerificationDecision = async (id: string, payload: VerificationDecisionPayload) => {
  const response = await axios.post(`${ADMIN_VERIFICATION_PROXY}/${id}/decision`, payload, { withCredentials: true });
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
