import { localApi } from "@/lib/axios";
import type {
  Wallet,
  Transaction,
  BankAccount,
  WithdrawalRecord,
  InitializeFundingPayload,
  AddBankAccountPayload,
  RequestWithdrawalPayload,
} from "@/types/api.types";

const paymentService = {
  /**
   * Get current user's wallet details.
   */
  getWallet: async (): Promise<Wallet> => {
    const response = await localApi.get("/api/proxy/payments/wallet");
    return response.data;
  },

  /**
   * Get user's transaction history.
   */
  getTransactions: async (
    type?: string,
    status?: string,
    page = 1,
    limit = 20
  ): Promise<{ transactions: Transaction[]; pagination: any }> => {
    const response = await localApi.get("/api/proxy/payments/transactions", {
      params: { type, status, page, limit },
    });
    return response.data;
  },

  /**
   * Initialize wallet funding via Flutterwave.
   */
  initializeFunding: async (
    data: InitializeFundingPayload
  ): Promise<{ paymentLink: string; txRef: string }> => {
    const response = await localApi.post("/api/proxy/payments/fund/initialize", data);
    return response.data;
  },

  /**
   * Verify a completed Flutterwave payment.
   */
  verifyFunding: async (
    transactionId: string
  ): Promise<{ status: string; transaction: Transaction; wallet: Wallet }> => {
    const response = await localApi.get("/api/proxy/payments/fund/verify", {
      params: { transaction_id: transactionId },
    });
    return response.data;
  },

  /**
   * Get supported banks for withdrawals.
   */
  getSupportedBanks: async (): Promise<{ code: string; name: string }[]> => {
    const response = await localApi.get("/api/proxy/payments/banks");
    return response.data || [];
  },

  /**
   * Add a new withdrawal bank account.
   */
  addBankAccount: async (data: AddBankAccountPayload): Promise<BankAccount> => {
    const response = await localApi.post("/api/proxy/payments/bank-accounts", data);
    return response.data;
  },

  /**
   * List all registered bank accounts.
   */
  listBankAccounts: async (): Promise<BankAccount[]> => {
    const response = await localApi.get("/api/proxy/payments/bank-accounts");
    return response.data || [];
  },

  /**
   * Remove a registered bank account.
   */
  removeBankAccount: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await localApi.delete(`/api/proxy/payments/bank-accounts/${id}`);
    return response.data;
  },

  /**
   * Request a payout withdrawal to bank.
   */
  requestWithdrawal: async (data: RequestWithdrawalPayload): Promise<any> => {
    const response = await localApi.post("/api/proxy/payments/withdraw", data);
    return response.data;
  },

  /**
   * Get withdrawal records history.
   */
  getWithdrawals: async (
    page = 1,
    limit = 20
  ): Promise<{ withdrawals: WithdrawalRecord[]; pagination: any }> => {
    const response = await localApi.get("/api/proxy/payments/withdrawals", {
      params: { page, limit },
    });
    return response.data;
  },
};

export default paymentService;
