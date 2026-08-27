import { useState, useCallback, useEffect } from "react";
import {
  verificationService,
  VerificationItem,
  VerificationStats,
  VerificationDecisionPayload,
} from "@/services/admin/verification.service";

export function useAdminVerification(initialParams?: { page?: number; limit?: number }) {
  const [requests, setRequests] = useState<VerificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<VerificationStats>({
    totalRequests: 0,
    pendingReview: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    expiredIncomplete: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(initialParams?.page || 1);
  const limit = initialParams?.limit || 10;

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await verificationService.getVerificationRequests({
        page,
        limit,
        search: searchQuery || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        verificationType: typeFilter !== "ALL" ? typeFilter : undefined,
      });

      const body = res?.data || res;
      const items = body?.requests || body?.verifications || (Array.isArray(body) ? body : []);
      setRequests(items);
      setTotal(body?.total || items.length);

      if (body?.stats) {
        setStats(body.stats);
      } else {
        setStats({
          totalRequests: items.length,
          pendingReview: items.filter((r: VerificationItem) => r.status === "Pending").length,
          underReview: items.filter((r: VerificationItem) => r.status === "Under Review").length,
          approved: items.filter((r: VerificationItem) => r.status === "Approved").length,
          rejected: items.filter((r: VerificationItem) => r.status === "Rejected").length,
          expiredIncomplete: items.filter((r: VerificationItem) => r.status === "Expired" || r.status === "Incomplete").length,
        });
      }
    } catch (err) {
      console.error("Error fetching verification requests from API:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter, typeFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const submitDecision = async (id: string, payload: VerificationDecisionPayload) => {
    setIsSubmitting(true);
    try {
      await verificationService.processVerificationDecision(id, payload);
      await fetchRequests();
      return true;
    } catch (err) {
      console.error("Failed to submit verification decision:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    requests,
    total,
    stats,
    isLoading,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    page,
    setPage,
    submitDecision,
    refetch: fetchRequests,
  };
}

export default useAdminVerification;
