import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

// ─── Backend Response Shapes ─────────────────────────────────────────────────
// These interfaces match the actual backend Prisma model includes

export interface BackendUser {
  id: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatarUrl: string | null;
  tier?: string;
  isVerified?: boolean;
}

// ─── Transaction Interfaces ─────────────────────────────────────────────────

export interface BackendTransaction {
  id: string;
  userId: string;
  type: "FUNDING" | "WITHDRAWAL" | "ESCROW_CREDIT" | "ESCROW_DEBIT";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
  amount: string | number;
  balanceBefore: string | number;
  balanceAfter: string | number;
  reference: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  user: BackendUser;
  paymentRecord?: {
    id: string;
    txRef: string;
    flwRef: string | null;
    paymentMethod: string | null;
    type: string;
    status: string;
    flutterwaveData: Record<string, unknown> | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsResponse {
  transactions: BackendTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalTransactions: number;
    pending: number;
    completed: number;
    failed: number;
  };
}

// ─── Frontend-Mapped Transaction (used by UI components) ─────────────────────

export interface PaymentTransactionItem {
  id: string;
  transactionId: string;
  payerName: string;
  payerEmail: string;
  payerAvatar?: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  createdAt: string;
}

export interface PaymentStats {
  totalPayments: number;
  netRevenue: number;
  escrowHeld: number;
  pendingPayouts: number;
  refundClaims: number;
}

// ─── Dispute Interfaces ─────────────────────────────────────────────────────

export interface BackendDispute {
  id: string;
  reason: string;
  description: string | null;
  category: string;
  status: string;
  transactionId: string | null;
  reporter: BackendUser;
  reportedUser: BackendUser;
  project: {
    id: string;
    name: string;
    genre: string | null;
    status: string;
  } | null;
  assignedAdmin: {
    id: string;
    email: string;
    role: string;
  } | null;
  decision: {
    id: string;
    resolutionSummary: string;
    outcome: string;
    resolvedAt: string;
  } | null;
  _count: {
    notes: number;
    messages: number;
    evidenceRequests: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DisputesResponse {
  disputes: BackendDispute[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalDisputes: number;
    byStatus: {
      open: number;
      underReview: number;
      awaitingResponse: number;
      resolved: number;
      closed: number;
    };
    byCategory: {
      payment: number;
      escrowMilestone: number;
      agreementRelated: number;
      projectCollaboration: number;
      userConduct: number;
    };
  };
}

export interface PaymentDisputeItem {
  id: string;
  disputeId: string;
  transactionId: string;
  amount: number;
  disputingUser: string;
  respondentUser: string;
  reason: string;
  status: string;
  createdAt: string;
}

// ─── Withdrawal Interfaces ──────────────────────────────────────────────────

export interface BackendWithdrawal {
  id: string;
  userId: string;
  txRef: string;
  flwRef: string | null;
  amount: string | number;
  status: string;
  paymentMethod: string | null;
  user: BackendUser & {
    bankAccounts?: {
      bankCode: string;
      bankName: string;
      accountNumber: string;
      accountName: string;
    }[];
  };
  createdAt: string;
}

export interface WithdrawalsResponse {
  withdrawals: BackendWithdrawal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalWithdrawals: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
}

export interface WithdrawalRequestItem {
  id: string;
  requestId: string;
  userName: string;
  userEmail: string;
  amount: number;
  method: string;
  accountDetails: string;
  status: string;
  createdAt: string;
}

// ─── Subscription Payment Interfaces ────────────────────────────────────────

export interface BackendSubscriptionPayment {
  id: string;
  invoiceNumber: string | null;
  amount: string | number;
  status: string;
  tier: string;
  billingCycle: string;
  periodStart: string | null;
  periodEnd: string | null;
  paidAt: string | null;
  user: BackendUser & {
    tier?: string;
    subscription?: {
      status: string;
      billingCycle: string;
      canceledAt: string | null;
      cancelAtPeriodEnd: boolean;
    } | null;
  };
  createdAt: string;
}

export interface SubscriptionPaymentsResponse {
  invoices: BackendSubscriptionPayment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalInvoices: number;
    paid: number;
    pending: number;
    failed: number;
  };
}

export interface ActiveSubscriptionItem {
  id: string;
  userName: string;
  userEmail: string;
  planTier: string;
  billingCycle: string;
  nextBillingDate: string;
  amount: number;
  status: string;
}

// ─── Audit Log Interfaces ───────────────────────────────────────────────────

export interface BackendAuditLog {
  id: string;
  action: string;
  details: string | null;
  admin: {
    id: string;
    email: string;
    role: string;
  } | null;
  targetUser: {
    id: string;
    displayName: string | null;
    email: string;
  } | null;
  createdAt: string;
}

export interface AuditLogsResponse {
  auditLogs: BackendAuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentAuditEntry {
  id: string;
  indexNumber: number;
  actionPerformed: string;
  administratorName: string;
  role: string;
  target: string;
  reason: string;
  dateTime: string;
}

// ─── Payment Reports Interface ──────────────────────────────────────────────

export interface PaymentReportResponse {
  reportMetadata: {
    generatedAt: string;
    filtersApplied: Record<string, unknown>;
  };
  summary: {
    totalTransactions: number;
    totalVolume: string | number;
    averageAmount: string | number;
    breakdownByType: { type: string; count: number; totalAmount: string | number }[];
    breakdownByStatus: { status: string; count: number; totalAmount: string | number }[];
  };
  transactions: BackendTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Helper: Get display name from backend user ─────────────────────────────

const getUserDisplayName = (user: BackendUser): string => {
  if (user.displayName) return user.displayName;
  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : user.email;
};

// ─── Helper: Map backend transaction to frontend shape ──────────────────────

const mapTransaction = (t: BackendTransaction): PaymentTransactionItem => ({
  id: t.id,
  transactionId: t.reference || t.id.slice(-8).toUpperCase(),
  payerName: getUserDisplayName(t.user),
  payerEmail: t.user.email,
  payerAvatar: t.user.avatarUrl || undefined,
  type: t.type,
  amount: Number(t.amount),
  currency: "NGN",
  status: t.status,
  gateway: t.paymentRecord?.paymentMethod || "Platform",
  createdAt: t.createdAt,
});

// ═══════════════════════════════════════════════════════════════════════════════
// Service Functions
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Transactions ───────────────────────────────────────────────────────────

export const getPaymentTransactions = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}): Promise<{ transactions: PaymentTransactionItem[]; total: number; stats: TransactionsResponse["stats"] }> => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_TRANSACTIONS.LIST, { params });
    const data = res.data as TransactionsResponse;
    return {
      transactions: (data.transactions || []).map(mapTransaction),
      total: data.total || 0,
      stats: data.stats || { totalTransactions: 0, pending: 0, completed: 0, failed: 0 },
    };
  } catch {
    return {
      transactions: [],
      total: 0,
      stats: { totalTransactions: 0, pending: 0, completed: 0, failed: 0 },
    };
  }
};

export const getPaymentDetail = async (id: string): Promise<PaymentTransactionItem | null> => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_TRANSACTIONS.DETAIL(id));
    const t = res.data as BackendTransaction;
    return mapTransaction(t);
  } catch {
    return null;
  }
};

// ─── Payment Stats (aggregated from transactions) ───────────────────────────

export const getPaymentStats = async (): Promise<PaymentStats> => {
  try {
    // Fetch transaction stats and report summary in parallel
    const [txRes, reportRes] = await Promise.allSettled([
      axiosInstance.get(API_ENDPOINTS.ADMIN_TRANSACTIONS.LIST, { params: { page: 1, limit: 1 } }),
      axiosInstance.get(API_ENDPOINTS.ADMIN_PAYMENTS.REPORTS, { params: { page: 1, limit: 1 } }),
    ]);

    const txStats = txRes.status === "fulfilled"
      ? (txRes.value.data as TransactionsResponse).stats
      : null;

    const reportSummary = reportRes.status === "fulfilled"
      ? (reportRes.value.data as PaymentReportResponse).summary
      : null;

    return {
      totalPayments: Number(reportSummary?.totalVolume || 0),
      netRevenue: Number(reportSummary?.totalVolume || 0) * 0.1,
      escrowHeld: 0,
      pendingPayouts: txStats?.pending || 0,
      refundClaims: txStats?.failed || 0,
    };
  } catch {
    return {
      totalPayments: 0,
      netRevenue: 0,
      escrowHeld: 0,
      pendingPayouts: 0,
      refundClaims: 0,
    };
  }
};

// ─── Disputes ───────────────────────────────────────────────────────────────

export const getPaymentDisputes = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}): Promise<{ disputes: PaymentDisputeItem[]; total: number; stats: DisputesResponse["stats"] }> => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_DISPUTES.LIST, { params });
    const data = res.data as DisputesResponse;
    return {
      disputes: (data.disputes || []).map((d) => ({
        id: d.id,
        disputeId: `DSP-${d.id.slice(-6).toUpperCase()}`,
        transactionId: d.transactionId || "N/A",
        amount: 0,
        disputingUser: getUserDisplayName(d.reporter),
        respondentUser: getUserDisplayName(d.reportedUser),
        reason: d.reason,
        status: d.status,
        createdAt: d.createdAt,
      })),
      total: data.total || 0,
      stats: data.stats || {
        totalDisputes: 0,
        byStatus: { open: 0, underReview: 0, awaitingResponse: 0, resolved: 0, closed: 0 },
        byCategory: { payment: 0, escrowMilestone: 0, agreementRelated: 0, projectCollaboration: 0, userConduct: 0 },
      },
    };
  } catch {
    return {
      disputes: [],
      total: 0,
      stats: {
        totalDisputes: 0,
        byStatus: { open: 0, underReview: 0, awaitingResponse: 0, resolved: 0, closed: 0 },
        byCategory: { payment: 0, escrowMilestone: 0, agreementRelated: 0, projectCollaboration: 0, userConduct: 0 },
      },
    };
  }
};

export const getDisputeDetail = async (id: string): Promise<BackendDispute | null> => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_DISPUTES.DETAIL(id));
    return res.data as BackendDispute;
  } catch {
    return null;
  }
};

export const assignDispute = async (id: string, adminId: string | null): Promise<boolean> => {
  try {
    await axiosInstance.patch(API_ENDPOINTS.ADMIN_DISPUTES.ASSIGN(id), { adminId });
    return true;
  } catch {
    return false;
  }
};

export const updateDisputeStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    await axiosInstance.patch(API_ENDPOINTS.ADMIN_DISPUTES.UPDATE_STATUS(id), { status });
    return true;
  } catch {
    return false;
  }
};

export const getDisputeNotes = async (id: string, params?: { page?: number; limit?: number }) => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_DISPUTES.NOTES(id), { params });
    return res.data;
  } catch {
    return { notes: [], total: 0 };
  }
};

export const addDisputeNote = async (id: string, content: string): Promise<boolean> => {
  try {
    await axiosInstance.post(API_ENDPOINTS.ADMIN_DISPUTES.NOTES(id), { content });
    return true;
  } catch {
    return false;
  }
};

export const getDisputeMessages = async (id: string, params?: { page?: number; limit?: number }) => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_DISPUTES.MESSAGES(id), { params });
    return res.data;
  } catch {
    return { messages: [], total: 0 };
  }
};

export const sendDisputeMessage = async (
  id: string,
  payload: { message: string; attachments?: unknown[]; isInternal?: boolean }
): Promise<boolean> => {
  try {
    await axiosInstance.post(API_ENDPOINTS.ADMIN_DISPUTES.MESSAGES(id), payload);
    return true;
  } catch {
    return false;
  }
};

export const requestDisputeEvidence = async (
  id: string,
  payload: { requestedFrom: string; requestDetails: string; dueDate?: string }
): Promise<boolean> => {
  try {
    await axiosInstance.post(API_ENDPOINTS.ADMIN_DISPUTES.REQUEST_EVIDENCE(id), payload);
    return true;
  } catch {
    return false;
  }
};

export const recordDisputeDecision = async (
  id: string,
  payload: { resolutionSummary: string; outcome: string; supportingNotes?: string; financialAdjustment?: Record<string, unknown> }
): Promise<boolean> => {
  try {
    await axiosInstance.post(API_ENDPOINTS.ADMIN_DISPUTES.DECISION(id), payload);
    return true;
  } catch {
    return false;
  }
};

// ─── Withdrawals ────────────────────────────────────────────────────────────

export const getWithdrawals = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<{ withdrawals: WithdrawalRequestItem[]; total: number; stats: WithdrawalsResponse["stats"] }> => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_FINANCE.WITHDRAWALS, { params });
    const data = res.data as WithdrawalsResponse;
    return {
      withdrawals: (data.withdrawals || []).map((w) => {
        const bankAccount = w.user?.bankAccounts?.[0];
        return {
          id: w.id,
          requestId: w.txRef || w.id.slice(-8).toUpperCase(),
          userName: getUserDisplayName(w.user),
          userEmail: w.user.email,
          amount: Number(w.amount),
          method: bankAccount?.bankName || "Bank Transfer",
          accountDetails: bankAccount
            ? `${bankAccount.accountName} • ${bankAccount.accountNumber}`
            : "N/A",
          status: w.status,
          createdAt: w.createdAt,
        };
      }),
      total: data.total || 0,
      stats: data.stats || { totalWithdrawals: 0, pending: 0, processing: 0, completed: 0, failed: 0 },
    };
  } catch {
    return {
      withdrawals: [],
      total: 0,
      stats: { totalWithdrawals: 0, pending: 0, processing: 0, completed: 0, failed: 0 },
    };
  }
};

// ─── Subscription Payments ──────────────────────────────────────────────────

export const getSubscriptionPayments = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tier?: string;
  billingCycle?: string;
}): Promise<{ subscriptions: ActiveSubscriptionItem[]; total: number; stats: SubscriptionPaymentsResponse["stats"] }> => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_FINANCE.SUBSCRIPTION_PAYMENTS, { params });
    const data = res.data as SubscriptionPaymentsResponse;
    return {
      subscriptions: (data.invoices || []).map((inv) => ({
        id: inv.id,
        userName: getUserDisplayName(inv.user),
        userEmail: inv.user.email,
        planTier: inv.tier || inv.user?.tier || "BASIC",
        billingCycle: inv.billingCycle || "MONTHLY",
        nextBillingDate: inv.periodEnd || "",
        amount: Number(inv.amount),
        status: inv.status,
      })),
      total: data.total || 0,
      stats: data.stats || { totalInvoices: 0, paid: 0, pending: 0, failed: 0 },
    };
  } catch {
    return {
      subscriptions: [],
      total: 0,
      stats: { totalInvoices: 0, paid: 0, pending: 0, failed: 0 },
    };
  }
};

// ─── Payment Audit Logs ─────────────────────────────────────────────────────

export const getPaymentAuditLogs = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  adminId?: string;
}): Promise<{ auditLogs: PaymentAuditEntry[]; total: number }> => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_PAYMENTS.AUDIT, { params });
    const data = res.data as AuditLogsResponse;
    return {
      auditLogs: (data.auditLogs || []).map((log, i) => ({
        id: log.id,
        indexNumber: i + 1 + (((params?.page || 1) - 1) * (params?.limit || 10)),
        actionPerformed: log.action,
        administratorName: log.admin?.email || "System",
        role: log.admin?.role || "N/A",
        target: log.targetUser
          ? (log.targetUser.displayName || log.targetUser.email)
          : "N/A",
        reason: log.details || "",
        dateTime: new Date(log.createdAt).toLocaleString(),
      })),
      total: data.total || 0,
    };
  } catch {
    return { auditLogs: [], total: 0 };
  }
};

// ─── Payment Reports ────────────────────────────────────────────────────────

export const getPaymentReports = async (params?: {
  dateStart?: string;
  dateEnd?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaymentReportResponse | null> => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_PAYMENTS.REPORTS, { params });
    return res.data as PaymentReportResponse;
  } catch {
    return null;
  }
};

// ─── Manual Payout (placeholder — no backend endpoint yet) ──────────────────

export const processManualPayout = async (
  _payload?: { userId?: string; amount?: number; reason?: string }
): Promise<boolean> => {
  void _payload;
  return true;
};
