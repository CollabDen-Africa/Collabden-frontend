export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: "MONTHLY" | "ANNUAL";
  features: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  tier: "ADVANCE" | "PRO" | "ELITE";
  status: "ACTIVE" | "PAST_DUE" | "CANCELED" | "UNPAID";
  billingCycle: "MONTHLY" | "ANNUAL";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  status: "PAID" | "UNPAID";
  billingDate: string;
}

export interface PaymentMethod {
  id: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  type: "CARD" | "BANK_TRANSFER";
  isDefault: boolean;
}

export interface SavePaymentMethodPayload {
  token: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  type: "CARD" | "BANK_TRANSFER";
}
