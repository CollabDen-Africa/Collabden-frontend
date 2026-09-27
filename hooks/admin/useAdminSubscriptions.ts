import { useState, useCallback, useEffect } from "react";
import {
  adminSubscriptionsService,
  SubscriptionItem,
} from "@/services/admin/subscriptions.service";

export function useAdminSubscriptions(initialParams?: { page?: number; limit?: number }) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [backendStats, setBackendStats] = useState<{ totalInvoices: number; paid: number; pending: number; failed: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [renewalFilter, setRenewalFilter] = useState("ALL");
  const [page, setPage] = useState(initialParams?.page || 1);
  const limit = initialParams?.limit || 10;

  const fetchSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminSubscriptionsService.getSubscriptions({
        page,
        limit,
        search: searchQuery || undefined,
        plan: planFilter !== "ALL" ? planFilter : undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        paymentStatus: paymentStatusFilter !== "ALL" ? paymentStatusFilter : undefined,
      });

      setSubscriptions(res.subscriptions);
      setTotal(res.total);
      setBackendStats(res.stats || null);
    } catch (err) {
      console.error("Error loading subscriptions:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery, planFilter, statusFilter, paymentStatusFilter]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Derived KPI Stat Metrics
  const stats = {
    totalSubscribers: backendStats?.totalInvoices || total,
    active: backendStats?.paid || 0,
    cancelled: 0,
    failedPayments: backendStats?.failed || 0,
    trialsPending: backendStats?.pending || 0,
    mrr: "—",
  };

  return {
    subscriptions,
    total,
    isLoading,
    stats,
    searchQuery,
    setSearchQuery,
    planFilter,
    setPlanFilter,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    renewalFilter,
    setRenewalFilter,
    page,
    setPage,
    refetch: fetchSubscriptions,
  };
}

export default useAdminSubscriptions;
