import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { Escrow, EscrowMilestone, EscrowAllocation, ConfigureEscrowPayload, SubmitMilestonePayload } from "@/types/api.types";

const escrowService = {
  /**
   * Get personal escrow payments received.
   */
  getPersonalEscrowPayments: async (page = 1, limit = 20): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ESCROW.MY_PAYMENTS, {
      params: { page, limit },
    });
    return response.data?.data || response.data;
  },

  /**
   * Resolve an escrow dispute (admin or mediator).
   */
  resolveDispute: async (milestoneId: string, payload: { resolution: string; decision: string }): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ESCROW.DISPUTES_RESOLVE(milestoneId), payload);
    return response.data?.data || response.data;
  },

  /**
   * Configure escrow payment structure for a project.
   */
  configureEscrow: async (projectId: string, payload: ConfigureEscrowPayload): Promise<Escrow> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ESCROW.CONFIGURE(projectId), payload);
    return response.data?.data || response.data;
  },

  /**
   * Get escrow details for a project.
   */
  getProjectEscrow: async (projectId: string): Promise<Escrow & { milestones: EscrowMilestone[]; allocations: EscrowAllocation[] }> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ESCROW.DETAIL(projectId));
    return response.data?.data || response.data;
  },

  /**
   * Get escrow status dashboard.
   */
  getEscrowStatus: async (projectId: string): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ESCROW.STATUS(projectId));
    return response.data?.data || response.data;
  },

  /**
   * Approve, request changes, or reject escrow proposal as a collaborator.
   */
  approveEscrowProposal: async (projectId: string, status: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED", comment?: string): Promise<EscrowAllocation> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ESCROW.APPROVE_PROPOSAL(projectId), {
      status,
      comment,
    });
    return response.data?.data || response.data;
  },

  /**
   * Fund the escrow from the project owner's wallet.
   */
  fundEscrow: async (projectId: string): Promise<Escrow> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ESCROW.FUND(projectId));
    return response.data?.data || response.data;
  },

  /**
   * Get escrow payment history for a project.
   */
  getPaymentHistory: async (projectId: string): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ESCROW.PAYMENT_HISTORY(projectId));
    return response.data?.data || response.data;
  },

  /**
   * Get milestone details.
   */
  getMilestoneDetails: async (projectId: string, milestoneId: string): Promise<EscrowMilestone> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ESCROW.MILESTONE_DETAIL(projectId, milestoneId));
    return response.data?.data || response.data;
  },

  /**
   * Submit milestone evidence.
   */
  submitMilestoneEvidence: async (projectId: string, milestoneId: string, payload: SubmitMilestonePayload): Promise<EscrowMilestone> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ESCROW.MILESTONE_SUBMIT(projectId, milestoneId), payload);
    return response.data?.data || response.data;
  },

  /**
   * Approve a milestone and release payment.
   */
  approveMilestone: async (projectId: string, milestoneId: string): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ESCROW.MILESTONE_APPROVE(projectId, milestoneId));
    return response.data?.data || response.data;
  },

  /**
   * Raise a dispute on a milestone.
   */
  raiseMilestoneDispute: async (projectId: string, milestoneId: string, reason: string): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.ESCROW.MILESTONE_DISPUTE(projectId, milestoneId), {
      reason,
    });
    return response.data?.data || response.data;
  },
};

export default escrowService;
