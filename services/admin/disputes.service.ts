import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type DisputeType =
  | "PAYMENT"
  | "ESCROW_MILESTONE"
  | "AGREEMENT"
  | "PROJECT_COLLABORATION"
  | "USER_CONDUCT";

export type DisputeStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "AWAITING_RESPONSE"
  | "RESOLVED"
  | "CLOSED";

export interface DisputeUser {
  id: string;
  name: string;
  initials?: string;
  avatarColor?: string;
}

export interface Dispute {
  id: string;
  disputeCode: string;
  type: DisputeType;
  status: DisputeStatus;
  complainant: DisputeUser;
  respondent: DisputeUser;
  project?: string | null;
  reference: string;
  assignedAdmin?: string | null;
  createdAt: string;
}

export interface RelatedRecord {
  label: string;
  reference: string;
  color: string;
}

export interface Evidence {
  id: string;
  filename: string;
  type: string;
  submittedBy: string;
}

export interface InvestigationNote {
  id: string;
  adminName: string;
  adminRole: string;
  content: string;
  createdAt: string;
}

export interface DisputeAuditRecord {
  id: string;
  action: string;
  actionType: string[];
  description: string;
  adminName: string;
  adminRole: string;
  createdAt: string;
}

export interface DisputeDetail extends Dispute {
  amount?: string | null;
  reason: string;
  evidence: Evidence[];
  notes: InvestigationNote[];
  relatedRecords: RelatedRecord[];
  auditHistory: DisputeAuditRecord[];
}

export interface DisputesParams {
  search?: string;
  status?: string;
  category?: string;
  type?: string;
  dateStart?: string;
  dateEnd?: string;
  assignedAdminId?: string;
  assignedAdmin?: string;
  page?: number;
  limit?: number;
}

export interface DisputeDecisionPayload {
  favoredParty: "CLIENT" | "COLLABORATOR" | "SPLIT" | "NONE";
  resolutionSummary: string;
  clientRefundAmount?: number;
  collaboratorPayoutAmount?: number;
}

export const getDisputes = async (params?: DisputesParams) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_DISPUTES.LIST, { params });
  return response.data;
};

export const getDisputeById = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_DISPUTES.DETAIL(id));
  return response.data;
};

export const assignDispute = async (id: string, adminId: string) => {
  const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN_DISPUTES.ASSIGN(id), { adminId });
  return response.data;
};

export const updateDisputeStatus = async (id: string, status: string, reason?: string) => {
  const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN_DISPUTES.UPDATE_STATUS(id), { status, reason });
  return response.data;
};

export const addDisputeNote = async (id: string, note: string) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_DISPUTES.NOTES(id), { note });
  return response.data;
};

export const sendDisputeMessage = async (id: string, message: string) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_DISPUTES.MESSAGES(id), { message });
  return response.data;
};

export const requestDisputeEvidence = async (id: string, payload: { requestedFrom: string; deadline: string; description: string }) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_DISPUTES.REQUEST_EVIDENCE(id), payload);
  return response.data;
};

export const recordDisputeDecision = async (id: string, payload: DisputeDecisionPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_DISPUTES.DECISION(id), payload);
  return response.data;
};

export const getDisputeAuditLogs = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_DISPUTES.AUDIT_LOGS(id));
  return response.data;
};

export const disputesService = {
  getDisputes,
  getDisputeById,
  assignDispute,
  updateDisputeStatus,
  addDisputeNote,
  sendDisputeMessage,
  requestDisputeEvidence,
  recordDisputeDecision,
  getDisputeAuditLogs,
};

export default disputesService;
