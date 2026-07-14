import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import escrowService from "@/services/escrow.service";
import { ConfigureEscrowPayload, SubmitMilestonePayload } from "@/types/api.types";
import { handleApiError } from "@/lib/error-handler";

export const useEscrow = () => {
  const queryClient = useQueryClient();

  const usePersonalEscrowPayments = (page = 1, limit = 20) =>
    useQuery({
      queryKey: ["escrow", "personal-payments", page, limit],
      queryFn: () => escrowService.getPersonalEscrowPayments(page, limit),
    });

  const useConfigureEscrow = () =>
    useMutation({
      mutationFn: ({ projectId, payload }: { projectId: string; payload: ConfigureEscrowPayload }) =>
        escrowService.configureEscrow(projectId, payload),
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId] });
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "status"] });
      },
      onError: (error) => handleApiError(error),
    });

  const useProjectEscrow = (projectId: string) =>
    useQuery({
      queryKey: ["escrow", "project", projectId],
      queryFn: () => escrowService.getProjectEscrow(projectId),
      enabled: !!projectId,
    });

  const useEscrowStatus = (projectId: string) =>
    useQuery({
      queryKey: ["escrow", "project", projectId, "status"],
      queryFn: () => escrowService.getEscrowStatus(projectId),
      enabled: !!projectId,
    });

  const useApproveEscrowProposal = () =>
    useMutation({
      mutationFn: ({ projectId, status, comment }: { projectId: string; status: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED"; comment?: string }) =>
        escrowService.approveEscrowProposal(projectId, status, comment),
      onSuccess: (_, { projectId }) => {
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId] });
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "status"] });
      },
      onError: (error) => handleApiError(error),
    });

  const useFundEscrow = () =>
    useMutation({
      mutationFn: (projectId: string) => escrowService.fundEscrow(projectId),
      onSuccess: (_, projectId) => {
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId] });
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "status"] });
        queryClient.invalidateQueries({ queryKey: ["payments", "wallet"] });
      },
      onError: (error) => handleApiError(error),
    });

  const useMilestoneDetails = (projectId: string, milestoneId: string) =>
    useQuery({
      queryKey: ["escrow", "project", projectId, "milestone", milestoneId],
      queryFn: () => escrowService.getMilestoneDetails(projectId, milestoneId),
      enabled: !!projectId && !!milestoneId,
    });

  const useSubmitMilestoneEvidence = () =>
    useMutation({
      mutationFn: ({ projectId, milestoneId, payload }: { projectId: string; milestoneId: string; payload: SubmitMilestonePayload }) =>
        escrowService.submitMilestoneEvidence(projectId, milestoneId, payload),
      onSuccess: (_, { projectId, milestoneId }) => {
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId] });
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "status"] });
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "milestone", milestoneId] });
      },
      onError: (error) => handleApiError(error),
    });

  const useApproveMilestone = () =>
    useMutation({
      mutationFn: ({ projectId, milestoneId }: { projectId: string; milestoneId: string }) =>
        escrowService.approveMilestone(projectId, milestoneId),
      onSuccess: (_, { projectId, milestoneId }) => {
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId] });
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "status"] });
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "milestone", milestoneId] });
        queryClient.invalidateQueries({ queryKey: ["payments", "wallet"] });
      },
      onError: (error) => handleApiError(error),
    });

  const useRaiseMilestoneDispute = () =>
    useMutation({
      mutationFn: ({ projectId, milestoneId, reason }: { projectId: string; milestoneId: string; reason: string }) =>
        escrowService.raiseMilestoneDispute(projectId, milestoneId, reason),
      onSuccess: (_, { projectId, milestoneId }) => {
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId] });
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "status"] });
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "milestone", milestoneId] });
      },
      onError: (error) => handleApiError(error),
    });

  return {
    usePersonalEscrowPayments,
    useConfigureEscrow,
    useProjectEscrow,
    useEscrowStatus,
    useApproveEscrowProposal,
    useFundEscrow,
    useMilestoneDetails,
    useSubmitMilestoneEvidence,
    useApproveMilestone,
    useRaiseMilestoneDispute,
  };
};
