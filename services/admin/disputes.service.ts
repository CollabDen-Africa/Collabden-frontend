import axios from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

const ADMIN_DISPUTES_PROXY = "/api/proxy/admin/disputes";

const adminProxyGet = async <T>(path: string, params?: Record<string, unknown>): Promise<T> => {
  const response = await axios.get<T>(path, { params, withCredentials: true });
  return response.data;
};

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

interface BackendDisputeListItem {
  id: string;
  category: string;
  status: DisputeStatus;
  transactionId?: string | null;
  reporter?: { id: string; displayName?: string | null; firstName?: string | null; lastName?: string | null; email: string };
  reportedUser?: { id: string; displayName?: string | null; firstName?: string | null; lastName?: string | null; email: string };
  project?: { name: string } | null;
  assignedAdmin?: { email: string } | null;
  createdAt: string;
}

interface BackendDisputesResponse {
  disputes: BackendDisputeListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalDisputes: number;
    byStatus: { open: number; underReview: number; awaitingResponse: number; resolved: number; closed: number };
  };
}

const getUserName = (user?: BackendDisputeListItem["reporter"]): string => {
  if (!user) return "Unknown user";
  if (user.displayName) return user.displayName;
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.email;
};

const mapDisputeType = (category: string): DisputeType =>
  category === "AGREEMENT_RELATED" ? "AGREEMENT" : category as DisputeType;

export const getDisputes = async (params?: DisputesParams): Promise<any> => {
  const category = params?.category || (params?.type === "AGREEMENT" ? "AGREEMENT_RELATED" : params?.type);
  const assignedAdminId = params?.assignedAdmin === "UNASSIGNED" ? "unassigned" : params?.assignedAdminId;
  const query = { ...(params || {}) };
  delete query.type;
  delete query.assignedAdmin;
  const data = await adminProxyGet<BackendDisputesResponse>(ADMIN_DISPUTES_PROXY, {
    ...query,
    category,
    assignedAdminId,
  });

  return {
    disputes: data.disputes.map((dispute) => ({
      id: dispute.id,
      disputeCode: `DSP-${dispute.id.slice(-6).toUpperCase()}`,
      type: mapDisputeType(dispute.category),
      status: dispute.status,
      complainant: { id: dispute.reporter?.id || "", name: getUserName(dispute.reporter) },
      respondent: { id: dispute.reportedUser?.id || "", name: getUserName(dispute.reportedUser) },
      project: dispute.project?.name || null,
      reference: dispute.transactionId || dispute.id,
      assignedAdmin: dispute.assignedAdmin?.email || null,
      createdAt: dispute.createdAt,
    })),
    total: data.total,
    page: data.page,
    totalPages: data.totalPages,
    stats: {
      total: data.stats.totalDisputes,
      open: data.stats.byStatus.open,
      underReview: data.stats.byStatus.underReview,
      awaitingResponse: data.stats.byStatus.awaitingResponse,
      resolved: data.stats.byStatus.resolved + data.stats.byStatus.closed,
    },
  };
};

export const getDisputeById = async (id: string): Promise<any> => {
  return adminProxyGet(`${ADMIN_DISPUTES_PROXY}/${id}`);
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
