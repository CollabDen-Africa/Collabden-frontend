export type TransactionType = "FUNDING" | "WITHDRAWAL" | "ESCROW_CREDIT" | "ESCROW_DEBIT";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference: string;
  description: string | null;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  createdAt: string;
}

export interface WithdrawalRecord {
  id: string;
  txRef: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  createdAt: string;
}

export interface InitializeFundingPayload {
  amount: number;
  paymentMethod: "card" | "banktransfer" | "ussd";
}

export interface AddBankAccountPayload {
  bankCode: string;
  accountNumber: string;
}

export interface RequestWithdrawalPayload {
  bankAccountId: string;
  amount: number;
}
