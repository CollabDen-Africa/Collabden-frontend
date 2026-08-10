import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAgreementsService } from "@/services/admin/agreements.service";

export const useAdminAgreements = (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
  const queryClient = useQueryClient();

  const overviewQuery = useQuery({
    queryKey: ["admin", "agreements", "overview"],
    queryFn: () => adminAgreementsService.getAgreementsOverview(),
  });

  const agreementsQuery = useQuery({
    queryKey: ["admin", "agreements", "list", params?.page, params?.search, params?.status],
    queryFn: () => adminAgreementsService.getAgreements(params),
  });

  const reportsQuery = useQuery({
    queryKey: ["admin", "agreements", "reports"],
    queryFn: () => adminAgreementsService.getReports(),
  });

  const auditQuery = useQuery({
    queryKey: ["admin", "agreements", "audit"],
    queryFn: () => adminAgreementsService.getAuditHistory(),
  });

  const updateReportStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminAgreementsService.updateReportStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agreements"] });
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: ({ note, agreementId }: { note: string; agreementId?: string }) =>
      adminAgreementsService.createNote(note, agreementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "agreements"] });
    },
  });

  return {
    overview: overviewQuery.data,
    isLoadingOverview: overviewQuery.isLoading,
    agreements: agreementsQuery.data?.items || agreementsQuery.data || [],
    agreementsTotal: agreementsQuery.data?.total || 0,
    isLoadingAgreements: agreementsQuery.isLoading,
    reports: reportsQuery.data,
    isLoadingReports: reportsQuery.isLoading,
    auditHistory: auditQuery.data,
    isLoadingAudit: auditQuery.isLoading,
    updateReportStatus: updateReportStatusMutation.mutateAsync,
    createNote: createNoteMutation.mutateAsync,
  };
};

export const useAgreementDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ["admin", "agreements", "detail", id],
    queryFn: () => adminAgreementsService.getAgreementDetail(id),
    enabled: Boolean(id),
  });
};

export const useAgreementActivityQuery = (id: string) => {
  return useQuery({
    queryKey: ["admin", "agreements", "activity", id],
    queryFn: () => adminAgreementsService.getAgreementActivity(id),
    enabled: Boolean(id),
  });
};
