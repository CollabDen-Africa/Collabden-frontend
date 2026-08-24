import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface DisputesParams {
  search?: string;
  status?: string;
  category?: string;
  dateStart?: string;
  dateEnd?: string;
  assignedAdminId?: string;
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
