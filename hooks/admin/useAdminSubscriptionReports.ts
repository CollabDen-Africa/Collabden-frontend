import { useState, useCallback, useEffect } from "react";
import {
  adminSubscriptionsService,
  SubscriptionReportMetrics,
} from "@/services/admin/subscriptions.service";

export function useAdminSubscriptionReports() {
  const [reportsData, setReportsData] = useState<SubscriptionReportMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("Jul 1 - Jul 31, 2025");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All Statuses");

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminSubscriptionsService.getSubscriptionReports();
      setReportsData(data);
    } catch (err) {
      console.error("Failed to load subscription reports:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reportsData,
    isLoading,
    dateRange,
    setDateRange,
    planFilter,
    setPlanFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    generateReport: fetchReports,
    refetch: fetchReports,
  };
}

export default useAdminSubscriptionReports;
