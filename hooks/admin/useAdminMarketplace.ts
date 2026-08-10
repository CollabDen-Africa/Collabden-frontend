import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminMarketplaceService } from "@/services/admin/marketplace.service";

export const useAdminMarketplace = (params?: { page?: number; limit?: number; search?: string; category?: string; status?: string }) => {
  const queryClient = useQueryClient();

  const overviewQuery = useQuery({
    queryKey: ["admin", "marketplace", "overview"],
    queryFn: () => adminMarketplaceService.getMarketplaceOverview(),
  });

  const collaboratorsQuery = useQuery({
    queryKey: ["admin", "marketplace", "collaborators", params?.page, params?.search],
    queryFn: () => adminMarketplaceService.getCollaborators(params),
  });

  const postingsQuery = useQuery({
    queryKey: ["admin", "marketplace", "postings", params?.page, params?.search],
    queryFn: () => adminMarketplaceService.getProjectPostings(params),
  });

  const reportsQuery = useQuery({
    queryKey: ["admin", "marketplace", "reports", params?.category, params?.status, params?.search],
    queryFn: () => adminMarketplaceService.getReports(params),
  });

  const auditQuery = useQuery({
    queryKey: ["admin", "marketplace", "audit"],
    queryFn: () => adminMarketplaceService.getAuditHistory(),
  });

  const updateReportStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminMarketplaceService.updateReportStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "marketplace"] });
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
    collaborators: collaboratorsQuery.data?.items || collaboratorsQuery.data || [],
    collaboratorsTotal: collaboratorsQuery.data?.total || 0,
    isLoadingCollaborators: collaboratorsQuery.isLoading,
    postings: postingsQuery.data?.items || postingsQuery.data || [],
    postingsTotal: postingsQuery.data?.total || 0,
    isLoadingPostings: postingsQuery.isLoading,
    reports: reportsQuery.data?.items || reportsQuery.data || [],
    reportsTotal: reportsQuery.data?.total || 0,
    isLoadingReports: reportsQuery.isLoading,
    auditHistory: auditQuery.data,
    isLoadingAudit: auditQuery.isLoading,
    updateReportStatus: updateReportStatusMutation.mutateAsync,
    createNote: createNoteMutation.mutateAsync,
    moderateCollaborator: moderateCollaboratorMutation.mutateAsync,
    moderateProject: moderateProjectMutation.mutateAsync,
  };
};

export const useMarketplaceCollaboratorDetail = (id: string) => {
  return useQuery({
    queryKey: ["admin", "marketplace", "collaborator", id],
    queryFn: () => adminMarketplaceService.getCollaboratorDetail(id),
    enabled: Boolean(id),
  });
};

export const useMarketplacePostingDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ["admin", "marketplace", "posting", id],
    queryFn: () => adminMarketplaceService.getPostingDetail(id),
    enabled: Boolean(id),
  });
};
