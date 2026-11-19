import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import paymentService from "@/services/payment.service";
import type {
  InitializeFundingPayload,
  AddBankAccountPayload,
  UpdateBankAccountPayload,
  RequestWithdrawalPayload,
} from "@/types/api.types";

export const usePayment = () => {
  const queryClient = useQueryClient();

  // Fetch Wallet Balance
  const useWallet = () =>
    useQuery({
      queryKey: ["payments", "wallet"],
      queryFn: () => paymentService.getWallet(),
      meta: { errorContext: "wallet.load" },
    });

  // Fetch Transaction History
  const useTransactions = (type?: string, status?: string, page = 1, limit = 20) =>
    useQuery({
      queryKey: ["payments", "transactions", { type, status, page, limit }],
      queryFn: () => paymentService.getTransactions(type, status, page, limit),
      meta: { errorContext: "payments.load" },
    });

  // Initialize Funding (Flutterwave checkouts)
  const useInitializeFunding = () =>
    useMutation({
      mutationFn: (data: InitializeFundingPayload) => paymentService.initializeFunding(data),
      meta: { errorContext: "payments.fundWallet" },
    });

  // List Registered Bank Accounts
  const useBankAccounts = () =>
    useQuery({
      queryKey: ["payments", "bank-accounts"],
      queryFn: () => paymentService.listBankAccounts(),
      meta: { errorContext: "bank.load" },
    });

  // Add Bank Account
  const useAddBankAccount = () =>
    useMutation({
      mutationFn: (data: AddBankAccountPayload) => paymentService.addBankAccount(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["payments", "bank-accounts"] });
      },
      meta: { errorContext: "bank.add" },
    });

  // Update Bank Account
  const useUpdateBankAccount = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateBankAccountPayload }) => 
          paymentService.updateBankAccount(id, data),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["payments", "bank-accounts"] });
        },
      meta: { errorContext: "bank.update" },
      });

  // Remove Bank Account
  const useRemoveBankAccount = () =>
    useMutation({
      mutationFn: (id: string) => paymentService.removeBankAccount(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["payments", "bank-accounts"] });
      },
      meta: { errorContext: "bank.remove" },
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
      meta: { errorContext: "withdrawals.create" },
    });

  // Fetch Withdrawal Payout History
  const useWithdrawals = (page = 1, limit = 20) =>
    useQuery({
      queryKey: ["payments", "withdrawals", { page, limit }],
      queryFn: () => paymentService.getWithdrawals(page, limit),
      meta: { errorContext: "withdrawals.load" },
    });

  // Fetch Supported Banks
  const useSupportedBanks = () =>
    useQuery({
      queryKey: ["payments", "supported-banks"],
      queryFn: () => paymentService.getSupportedBanks(),
      staleTime: 24 * 60 * 60 * 1000, // 24 hours caching since bank list rarely changes
      meta: { errorContext: "bank.load" },
    });

  return {
    useWallet,
    useTransactions,
    useInitializeFunding,
    useBankAccounts,
    useAddBankAccount,
    useUpdateBankAccount,
    useRemoveBankAccount,
    useWithdraw,
    useWithdrawals,
    useSupportedBanks,
  };
};
