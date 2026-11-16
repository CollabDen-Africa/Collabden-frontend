import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import escrowService from "@/services/escrow.service";
import { ConfigureEscrowPayload, SubmitMilestonePayload } from "@/types/api.types";

export const useEscrow = () => {
  const queryClient = useQueryClient();

  const invalidateProject = (projectId: string) => {
    queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId] });
    queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "status"] });
  };

  const usePersonalEscrowPayments = (page = 1, limit = 20) =>
    useQuery({
      queryKey: ["escrow", "personal-payments", page, limit],
      queryFn: () => escrowService.getPersonalEscrowPayments(page, limit),
    });

  const useConfigureEscrow = () =>
    useMutation({
      mutationFn: ({ projectId, payload }: { projectId: string; payload: ConfigureEscrowPayload }) =>
        escrowService.configureEscrow(projectId, payload),
      onSuccess: (_, { projectId }) => invalidateProject(projectId),
      meta: { errorContext: "payments.escrowSave" },
    });

  // NOTE: the status/escrow queries intentionally have no toast meta. A 404 here can
  // simply mean "owner hasn't configured escrow yet", which the payments page handles itself.
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
      onSuccess: (_, { projectId }) => invalidateProject(projectId),
      // One hook, three actions: pick the wording from the status being submitted
      meta: {
        errorContext: (v: { status: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED" }) =>
          v.status === "REJECTED"
            ? "payments.escrowReject"
            : v.status === "CHANGES_REQUESTED"
              ? "payments.escrowRequestChanges"
              : "payments.escrowApprove",
      },
    });

  const useFundEscrow = () =>
    useMutation({
      mutationFn: (projectId: string) => escrowService.fundEscrow(projectId),
      onSuccess: (_, projectId) => {
        invalidateProject(projectId);
        queryClient.invalidateQueries({ queryKey: ["payments", "wallet"] });
      },
      meta: { errorContext: "payments.escrowFund" },
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
        invalidateProject(projectId);
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "milestone", milestoneId] });
      },
      meta: { errorContext: "escrow.submitEvidence" },
    });

  const useApproveMilestone = () =>
    useMutation({
      mutationFn: ({ projectId, milestoneId }: { projectId: string; milestoneId: string }) =>
        escrowService.approveMilestone(projectId, milestoneId),
      onSuccess: (_, { projectId, milestoneId }) => {
        invalidateProject(projectId);
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "milestone", milestoneId] });
        queryClient.invalidateQueries({ queryKey: ["payments", "wallet"] });
      },
      meta: { errorContext: "escrow.approveMilestone" },
    });

  const useRaiseMilestoneDispute = () =>
    useMutation({
      mutationFn: ({ projectId, milestoneId, reason }: { projectId: string; milestoneId: string; reason: string }) =>
        escrowService.raiseMilestoneDispute(projectId, milestoneId, reason),
      onSuccess: (_, { projectId, milestoneId }) => {
        invalidateProject(projectId);
        queryClient.invalidateQueries({ queryKey: ["escrow", "project", projectId, "milestone", milestoneId] });
      },
      meta: { errorContext: "escrow.raiseDispute" },
    });

  const useRemindCollaborator = () =>
    useMutation({
      mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
        escrowService.remindCollaborator(projectId, userId),
      meta: { errorContext: "escrow.remind" },
    });

  const useRemoveEscrowCollaborator = () =>
    useMutation({
      mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
        escrowService.removeCollaborator(projectId, userId),
      onSuccess: (_, { projectId }) => invalidateProject(projectId),
      meta: { errorContext: "escrow.removeCollaborator" },
    });

  const useUpdateEscrowTerms = () =>
    useMutation({
      mutationFn: ({ projectId, payload }: { projectId: string; payload: any }) =>
        escrowService.updateEscrowTerms(projectId, payload),
      onSuccess: (_, { projectId }) => invalidateProject(projectId),
      meta: { errorContext: "payments.escrowSave" },
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
    useRemindCollaborator,
    useRemoveEscrowCollaborator,
    useUpdateEscrowTerms,
  };
};