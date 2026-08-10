import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminMarketplaceService } from "@/services/admin/marketplace.service";

export const useAdminMarketplace = () => {
  const queryClient = useQueryClient();

  const overviewQuery = useQuery({
    queryKey: ["admin", "marketplace", "overview"],
    queryFn: () => adminMarketplaceService.getMarketplaceOverview(),
  });

  const reportsQuery = useQuery({
    queryKey: ["admin", "marketplace", "reports"],
    queryFn: () => adminMarketplaceService.getReports(),
  });

  const auditQuery = useQuery({
    queryKey: ["admin", "marketplace", "audit"],
    queryFn: () => adminMarketplaceService.getAuditHistory(),
  });

  const updateReportStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminMarketplaceService.updateReportStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "marketplace", "reports"] });
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: ({ note, targetId }: { note: string; targetId?: string }) =>
      adminMarketplaceService.createNote(note, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "marketplace"] });
    },
  });

  const moderateCollaboratorMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: string; reason?: string }) =>
      adminMarketplaceService.moderateCollaborator(id, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "marketplace"] });
    },
  });

  const moderateProjectMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: string; reason?: string }) =>
      adminMarketplaceService.moderateProject(id, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "marketplace"] });
    },
  });

  return {
    overview: overviewQuery.data,
    isLoadingOverview: overviewQuery.isLoading,
    reports: reportsQuery.data,
    isLoadingReports: reportsQuery.isLoading,
    auditHistory: auditQuery.data,
    isLoadingAudit: auditQuery.isLoading,
    updateReportStatus: updateReportStatusMutation.mutateAsync,
    createNote: createNoteMutation.mutateAsync,
    moderateCollaborator: moderateCollaboratorMutation.mutateAsync,
    moderateProject: moderateProjectMutation.mutateAsync,
  };
};
