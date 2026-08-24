import { useState, useCallback, useEffect } from "react";
import {
  verificationService,
  VerificationParams,
  VerificationDecisionPayload,
} from "@/services/admin/verification.service";

export interface VerificationRequestItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  documentType: string;
  documentNumber?: string;
  documentFrontUrl?: string;
  documentBackUrl?: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED" | "INCOMPLETE";
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedByAdmin?: string;
}

export function useAdminVerification(initialParams?: VerificationParams) {
  const [requests, setRequests] = useState<VerificationRequestItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<VerificationParams>({
    page: 1,
    limit: 10,
    status: "All",
    search: "",
    ...initialParams,
  });

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await verificationService.getVerificationRequests(filters);
      if (res?.success) {
        const rawData = res.data?.requests || res.data?.verifications || res.data || [];
        const formatted = rawData.map((item: any) => ({
          id: item.id,
          userId: item.userId || item.user?.id || "",
          userName: item.userName || `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.trim() || item.user?.email || "Unknown User",
          userEmail: item.userEmail || item.user?.email || "N/A",
          documentType: item.documentType || item.type || "ID Document",
          documentNumber: item.documentNumber || item.idNumber || "N/A",
          documentFrontUrl: item.documentFrontUrl || item.frontImage || "",
          documentBackUrl: item.documentBackUrl || item.backImage || "",
          submittedAt: item.createdAt || item.submittedAt || new Date().toISOString(),
          status: item.status || "PENDING",
          rejectionReason: item.rejectionReason,
          reviewedAt: item.reviewedAt,
          reviewedByAdmin: item.reviewedByAdmin,
        }));

        setRequests(formatted);
        
        if (res.data?.pagination || res.pagination) {
          const pg = res.data?.pagination || res.pagination;
          setPagination({
            page: pg.page || filters.page || 1,
            limit: pg.limit || filters.limit || 10,
            total: pg.total || pg.totalRecords || formatted.length,
            totalPages: pg.totalPages || Math.ceil((pg.total || formatted.length) / (filters.limit || 10)) || 1,
          });
        } else {
          setPagination(prev => ({ ...prev, total: formatted.length }));
        }

        if (res.data?.stats || res.stats) {
          const st = res.data?.stats || res.stats;
          setStats({
            pending: st.pendingCount || st.pending || 0,
            approved: st.approvedCount || st.approved || 0,
            rejected: st.rejectedCount || st.rejected || 0,
            total: st.totalCount || st.total || formatted.length,
          });
        } else {
          setStats({
            pending: formatted.filter((r: any) => r.status === "PENDING").length,
            approved: formatted.filter((r: any) => r.status === "APPROVED").length,
            rejected: formatted.filter((r: any) => r.status === "REJECTED").length,
            total: formatted.length,
          });
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch verification requests:", err);
      setError(err?.response?.data?.message || "Failed to load verification requests.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const res = await verificationService.getVerificationAuditHistory({ page: 1, limit: 20 });
      if (res?.success) {
        setAuditLogs(res.data?.auditLogs || res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch verification audit logs:", err);
    }
  }, []);

  const submitDecision = async (id: string, payload: VerificationDecisionPayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await verificationService.processVerificationDecision(id, payload);
      if (res?.success) {
        await fetchRequests();
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Failed to process verification decision:", err);
      setError(err?.response?.data?.message || "Failed to submit decision.");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    auditLogs,
    pagination,
    stats,
    isLoading,
    isSubmitting,
    error,
    filters,
    setFilters,
    refetch: fetchRequests,
    fetchAuditLogs,
    submitDecision,
  };
}

export default useAdminVerification;
