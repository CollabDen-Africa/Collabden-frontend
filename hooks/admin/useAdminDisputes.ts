import { useState, useCallback, useEffect } from "react";
import {
  disputesService,
  DisputesParams,
  DisputeDecisionPayload,
} from "@/services/admin/disputes.service";

export interface DisputeItem {
  id: string;
  disputeNumber?: string;
  category: string;
  reason: string;
  description: string;
  status: "OPEN" | "UNDER_REVIEW" | "AWAITING_RESPONSE" | "RESOLVED" | "CLOSED";
  favoredParty?: string;
  raisedBy?: {
    id: string;
    name: string;
    email: string;
  };
  assignedAdmin?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function useAdminDisputes(initialParams?: DisputesParams) {
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState({
    open: 0,
    underReview: 0,
    resolved: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<DisputesParams>({
    page: 1,
    limit: 10,
    status: "All",
    search: "",
    ...initialParams,
  });

  const fetchDisputes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await disputesService.getDisputes(filters);
      if (res?.success) {
        const rawData = res.data?.disputes || res.data || [];
        setDisputes(rawData);
        
        if (res.data?.pagination || res.pagination) {
          const pg = res.data?.pagination || res.pagination;
          setPagination({
            page: pg.page || filters.page || 1,
            limit: pg.limit || filters.limit || 10,
            total: pg.total || rawData.length,
            totalPages: pg.totalPages || 1,
          });
        }
        
        if (res.data?.stats || res.stats) {
          const st = res.data?.stats || res.stats;
          setStats({
            open: st.openCount || st.open || 0,
            underReview: st.underReviewCount || st.underReview || 0,
            resolved: st.resolvedCount || st.resolved || 0,
            total: st.totalCount || st.total || rawData.length,
          });
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch disputes:", err);
      setError(err?.response?.data?.message || "Failed to load disputes.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchDisputeDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await disputesService.getDisputeById(id);
      if (res?.success) {
        setSelectedDispute(res.data?.dispute || res.data);
        return res.data;
      }
    } catch (err: any) {
      console.error("Failed to fetch dispute detail:", err);
      setError(err?.response?.data?.message || "Failed to fetch dispute details.");
    } finally {
      setIsLoading(false);
    }
  };

  const assignAdminToDispute = async (id: string, adminId: string) => {
    setIsSubmitting(true);
    try {
      const res = await disputesService.assignDispute(id, adminId);
      if (res?.success) {
        await fetchDisputes();
        return true;
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to assign admin.");
    } finally {
      setIsSubmitting(false);
    }
    return false;
  };

  const updateStatus = async (id: string, status: string, reason?: string) => {
    setIsSubmitting(true);
    try {
      const res = await disputesService.updateDisputeStatus(id, status, reason);
      if (res?.success) {
        await fetchDisputes();
        return true;
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setIsSubmitting(false);
    }
    return false;
  };

  const resolveDispute = async (id: string, payload: DisputeDecisionPayload) => {
    setIsSubmitting(true);
    try {
      const res = await disputesService.recordDisputeDecision(id, payload);
      if (res?.success) {
        await fetchDisputes();
        return true;
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to record decision.");
    } finally {
      setIsSubmitting(false);
    }
    return false;
  };

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  return {
    disputes,
    selectedDispute,
    pagination,
    stats,
    isLoading,
    isSubmitting,
    error,
    filters,
    setFilters,
    refetch: fetchDisputes,
    fetchDisputeDetail,
    assignAdminToDispute,
    updateStatus,
    resolveDispute,
  };
}

export default useAdminDisputes;
