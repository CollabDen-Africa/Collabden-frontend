import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminAgreementsService } from "@/services/admin/agreements.service";

export const useAdminAgreements = () => {
  const queryClient = useQueryClient();

  const overviewQuery = useQuery({
    queryKey: ["admin", "agreements", "overview"],
    queryFn: () => adminAgreementsService.getAgreementsOverview(),
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
      queryClient.invalidateQueries({ queryKey: ["admin", "agreements", "reports"] });
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
    reports: reportsQuery.data,
    isLoadingReports: reportsQuery.isLoading,
    auditHistory: auditQuery.data,
    isLoadingAudit: auditQuery.isLoading,
    updateReportStatus: updateReportStatusMutation.mutateAsync,
    createNote: createNoteMutation.mutateAsync,
  };
};
