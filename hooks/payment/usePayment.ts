import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import paymentService from "@/services/payment.service";
import type {
  InitializeFundingPayload,
  AddBankAccountPayload,
  RequestWithdrawalPayload,
} from "@/types/api.types";
import { handleApiError } from "@/lib/error-handler";

export const usePayment = () => {
  const queryClient = useQueryClient();

  // Fetch Wallet Balance
  const useWallet = () =>
    useQuery({
      queryKey: ["payments", "wallet"],
      queryFn: () => paymentService.getWallet(),
    });

  // Fetch Transaction History
  const useTransactions = (type?: string, status?: string, page = 1, limit = 20) =>
    useQuery({
      queryKey: ["payments", "transactions", { type, status, page, limit }],
      queryFn: () => paymentService.getTransactions(type, status, page, limit),
    });

  // Initialize Funding (Flutterwave checkouts)
  const useInitializeFunding = () =>
    useMutation({
      mutationFn: (data: InitializeFundingPayload) => paymentService.initializeFunding(data),
      onError: (error) => handleApiError(error),
    });

  // List Registered Bank Accounts
  const useBankAccounts = () =>
    useQuery({
      queryKey: ["payments", "bank-accounts"],
      queryFn: () => paymentService.listBankAccounts(),
    });

  // Add Bank Account
  const useAddBankAccount = () =>
    useMutation({
      mutationFn: (data: AddBankAccountPayload) => paymentService.addBankAccount(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["payments", "bank-accounts"] });
      },
      onError: (error) => handleApiError(error),
    });

  // Remove Bank Account
  const useRemoveBankAccount = () =>
    useMutation({
      mutationFn: (id: string) => paymentService.removeBankAccount(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["payments", "bank-accounts"] });
      },
      onError: (error) => handleApiError(error),
    });

  // Request Payout Withdrawal
  const useWithdraw = () =>
    useMutation({
      mutationFn: (data: RequestWithdrawalPayload) => paymentService.requestWithdrawal(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["payments", "wallet"] });
        queryClient.invalidateQueries({ queryKey: ["payments", "transactions"] });
        queryClient.invalidateQueries({ queryKey: ["payments", "withdrawals"] });
      },
      onError: (error) => handleApiError(error),
    });

  // Fetch Withdrawal Payout History
  const useWithdrawals = (page = 1, limit = 20) =>
    useQuery({
      queryKey: ["payments", "withdrawals", { page, limit }],
      queryFn: () => paymentService.getWithdrawals(page, limit),
    });

  // Fetch Supported Banks
  const useSupportedBanks = () =>
    useQuery({
      queryKey: ["payments", "supported-banks"],
      queryFn: () => paymentService.getSupportedBanks(),
      staleTime: 24 * 60 * 60 * 1000, // 24 hours caching since bank list rarely changes
    });

  return {
    useWallet,
    useTransactions,
    useInitializeFunding,
    useBankAccounts,
    useAddBankAccount,
    useRemoveBankAccount,
    useWithdraw,
    useWithdrawals,
    useSupportedBanks,
  };
};
