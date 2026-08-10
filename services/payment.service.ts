import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
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
    const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.WALLET);
    return response.data?.data || response.data;
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
    const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.TRANSACTIONS, {
      params: { type, status, page, limit },
    });
    return response.data?.data || response.data;
  },

  /**
   * Initialize wallet funding via Flutterwave.
   */
  initializeFunding: async (
    data: InitializeFundingPayload
  ): Promise<{ paymentLink: string; txRef: string }> => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.FUND_INITIALIZE, data);
    return response.data?.data || response.data;
  },

  /**
   * Verify a completed Flutterwave payment.
   */
  verifyFunding: async (
    transactionId: string
  ): Promise<{ status: string; transaction: Transaction; wallet: Wallet }> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.FUND_VERIFY, {
      params: { transaction_id: transactionId },
    });
    return response.data?.data || response.data;
  },

  /**
   * Get supported banks for withdrawals.
   */
  getSupportedBanks: async (): Promise<{ code: string; name: string }[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.BANKS);
    return response.data?.data || response.data || [];
  },

  /**
   * Add a new withdrawal bank account.
   */
  addBankAccount: async (data: AddBankAccountPayload): Promise<BankAccount> => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.BANK_ACCOUNTS, data);
    return response.data?.data || response.data;
  },

  /**
   * List all registered bank accounts.
   */
  listBankAccounts: async (): Promise<BankAccount[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.BANK_ACCOUNTS);
    return response.data?.data || response.data || [];
  },

  /**
   * Get bank account details by ID.
   */
  getBankAccountDetail: async (id: string): Promise<BankAccount> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.BANK_ACCOUNT_DETAIL(id));
    return response.data?.data || response.data;
  },

  /**
   * Remove a registered bank account.
   */
  removeBankAccount: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.PAYMENTS.BANK_ACCOUNT_DETAIL(id));
    return response.data?.data || response.data;
  },

  /**
   * Request a payout withdrawal to bank.
   */
  requestWithdrawal: async (data: RequestWithdrawalPayload): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.WITHDRAW, data);
    return response.data?.data || response.data;
  },

  /**
   * Get withdrawal records history.
   */
  getWithdrawals: async (
    page = 1,
    limit = 20
  ): Promise<{ withdrawals: WithdrawalRecord[]; pagination: any }> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.WITHDRAWALS, {
      params: { page, limit },
    });
    return response.data?.data || response.data;
  },
};

export default paymentService;
