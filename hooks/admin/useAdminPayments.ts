import { useState, useEffect, useCallback } from "react";
import {
  getPaymentStats,
  getPaymentTransactions,
  getPaymentDisputes,
  getWithdrawals,
  getSubscriptionPayments,
  getPaymentAuditLogs,
  processManualPayout as apiProcessManualPayout,
  PaymentStats,
  PaymentTransactionItem,
  PaymentDisputeItem,
  WithdrawalRequestItem,
  ActiveSubscriptionItem,
  PaymentAuditEntry,
} from "@/services/admin/payments.service";

interface UseAdminPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  // Selective fetch flags — only load what the calling page needs
  loadStats?: boolean;
  loadTransactions?: boolean;
  loadDisputes?: boolean;
  loadWithdrawals?: boolean;
  loadSubscriptions?: boolean;
  loadAuditLogs?: boolean;
}

export const useAdminPayments = (params?: UseAdminPaymentsParams) => {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransactionItem[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [disputes, setDisputes] = useState<PaymentDisputeItem[]>([]);
  const [totalDisputes, setTotalDisputes] = useState(0);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequestItem[]>([]);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [subscriptions, setSubscriptions] = useState<ActiveSubscriptionItem[]>([]);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [auditLogs, setAuditLogs] = useState<PaymentAuditEntry[]>([]);
  const [totalAuditLogs, setTotalAuditLogs] = useState(0);

  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isLoadingDisputes, setIsLoadingDisputes] = useState(true);
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(true);
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(true);

  // Determine which data sources to load based on flags.
  // Default: if no flags are passed, load stats + transactions (main payments page behavior).
  const shouldLoadStats = params?.loadStats !== false;
  const shouldLoadTransactions = params?.loadTransactions !== false;
  const shouldLoadDisputes = params?.loadDisputes ?? false;
  const shouldLoadWithdrawals = params?.loadWithdrawals ?? false;
  const shouldLoadSubscriptions = params?.loadSubscriptions ?? false;
  const shouldLoadAuditLogs = params?.loadAuditLogs ?? false;

  const fetchStats = useCallback(async () => {
    if (!shouldLoadStats) { setIsLoadingStats(false); return; }
    setIsLoadingStats(true);
    const data = await getPaymentStats();
    setStats(data);
    setIsLoadingStats(false);
  }, [shouldLoadStats]);

  const fetchTransactions = useCallback(async () => {
    if (!shouldLoadTransactions) { setIsLoadingTransactions(false); return; }
    setIsLoadingTransactions(true);
    const data = await getPaymentTransactions({
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      status: params?.status,
    });
    setTransactions(data.transactions);
    setTotalTransactions(data.total);
    setIsLoadingTransactions(false);
  }, [shouldLoadTransactions, params?.page, params?.limit, params?.search, params?.status]);

  const fetchDisputes = useCallback(async () => {
    if (!shouldLoadDisputes) { setIsLoadingDisputes(false); return; }
    setIsLoadingDisputes(true);
    const data = await getPaymentDisputes({
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      status: params?.status,
    });
    setDisputes(data.disputes);
    setTotalDisputes(data.total);
    setIsLoadingDisputes(false);
  }, [shouldLoadDisputes, params?.page, params?.limit, params?.search, params?.status]);

  const fetchWithdrawals = useCallback(async () => {
    if (!shouldLoadWithdrawals) { setIsLoadingWithdrawals(false); return; }
    setIsLoadingWithdrawals(true);
    const data = await getWithdrawals({
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      status: params?.status,
    });
    setWithdrawals(data.withdrawals);
    setTotalWithdrawals(data.total);
    setIsLoadingWithdrawals(false);
  }, [shouldLoadWithdrawals, params?.page, params?.limit, params?.search, params?.status]);

  const fetchSubscriptions = useCallback(async () => {
    if (!shouldLoadSubscriptions) return;
    const data = await getSubscriptionPayments({
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
    });
    setSubscriptions(data.subscriptions);
    setTotalSubscriptions(data.total);
  }, [shouldLoadSubscriptions, params?.page, params?.limit, params?.search]);

  const fetchAuditLogs = useCallback(async () => {
    if (!shouldLoadAuditLogs) { setIsLoadingAuditLogs(false); return; }
    setIsLoadingAuditLogs(true);
    const data = await getPaymentAuditLogs({
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
    });
    setAuditLogs(data.auditLogs);
    setTotalAuditLogs(data.total);
    setIsLoadingAuditLogs(false);
  }, [shouldLoadAuditLogs, params?.page, params?.limit, params?.search]);

  useEffect(() => {
    fetchStats();
    fetchTransactions();
    fetchDisputes();
    fetchWithdrawals();
    fetchSubscriptions();
    fetchAuditLogs();
  }, [fetchStats, fetchTransactions, fetchDisputes, fetchWithdrawals, fetchSubscriptions, fetchAuditLogs]);

  const triggerManualPayout = async (payload?: { userId: string; amount: number; reason: string }) => {
    const success = await apiProcessManualPayout(payload);
    if (success) {
      fetchTransactions();
      fetchStats();
    }
    return success;
  };

  return {
    stats,
    isLoadingStats,
    transactions,
    totalTransactions,
    isLoadingTransactions,
    disputes,
    totalDisputes,
    isLoadingDisputes,
    withdrawals,
    totalWithdrawals,
    subscriptions,
    totalSubscriptions,
    isLoadingWithdrawals,
    auditLogs,
    totalAuditLogs,
    isLoadingAuditLogs,
    triggerManualPayout,
    refetchTransactions: fetchTransactions,
    refetchDisputes: fetchDisputes,
    refetchWithdrawals: fetchWithdrawals,
    refetchAuditLogs: fetchAuditLogs,
    refetchAll: () => {
      fetchStats();
      fetchTransactions();
      fetchDisputes();
      fetchWithdrawals();
      fetchSubscriptions();
      fetchAuditLogs();
    },
  };
};
