import { localApi } from "@/lib/axios";
import type { Escrow, EscrowMilestone, EscrowAllocation, ConfigureEscrowPayload, SubmitMilestonePayload } from "@/types/api.types";

const escrowService = {
  /**
   * Get personal escrow payments received.
   */
  getPersonalEscrowPayments: async (page = 1, limit = 20): Promise<any> => {
    const response = await localApi.get("/api/proxy/projects/escrow/my-payments", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Configure escrow payment structure for a project.
   */
  configureEscrow: async (projectId: string, payload: ConfigureEscrowPayload): Promise<Escrow> => {
    const response = await localApi.post(`/api/proxy/projects/${projectId}/escrow`, payload);
    return response.data;
  },

  /**
   * Get escrow details for a project.
   */
  getProjectEscrow: async (projectId: string): Promise<Escrow & { milestones: EscrowMilestone[]; allocations: EscrowAllocation[] }> => {
    const response = await localApi.get(`/api/proxy/projects/${projectId}/escrow`);
    return response.data;
  },

  /**
   * Get escrow status dashboard.
   */
  getEscrowStatus: async (projectId: string): Promise<any> => {
    const response = await localApi.get(`/api/proxy/projects/${projectId}/escrow/status`);
    return response.data;
  },

  /**
   * Approve, request changes, or reject escrow proposal as a collaborator.
   */
  approveEscrowProposal: async (projectId: string, status: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED", comment?: string): Promise<EscrowAllocation> => {
    const response = await localApi.patch(`/api/proxy/projects/${projectId}/escrow/approve`, {
      status,
      comment,
    });
    return response.data;
  },

  /**
   * Fund the escrow from the project owner's wallet.
   */
  fundEscrow: async (projectId: string): Promise<Escrow> => {
    const response = await localApi.post(`/api/proxy/projects/${projectId}/escrow/fund`);
    return response.data;
  },

  /**
   * Get milestone details.
   */
  getMilestoneDetails: async (projectId: string, milestoneId: string): Promise<EscrowMilestone> => {
    const response = await localApi.get(`/api/proxy/projects/${projectId}/escrow/milestones/${milestoneId}`);
    return response.data;
  },

  /**
   * Submit milestone evidence.
   */
  submitMilestoneEvidence: async (projectId: string, milestoneId: string, payload: SubmitMilestonePayload): Promise<EscrowMilestone> => {
    const response = await localApi.post(`/api/proxy/projects/${projectId}/escrow/milestones/${milestoneId}/submit`, payload);
    return response.data;
  },

  /**
   * Approve a milestone and release payment.
   */
  approveMilestone: async (projectId: string, milestoneId: string): Promise<any> => {
    const response = await localApi.patch(`/api/proxy/projects/${projectId}/escrow/milestones/${milestoneId}/approve`);
    return response.data;
  },

  /**
   * Raise a dispute on a milestone.
   */
  raiseMilestoneDispute: async (projectId: string, milestoneId: string, reason: string): Promise<any> => {
    const response = await localApi.post(`/api/proxy/projects/${projectId}/escrow/milestones/${milestoneId}/dispute`, {
      reason,
    });
    return response.data;
  },
};

export default escrowService;
