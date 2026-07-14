import { localApi } from "@/lib/axios";
import type { SubscriptionPlan, UserSubscription, Invoice, PaymentMethod, SavePaymentMethodPayload } from "@/types/api.types";

const subscriptionService = {
  /**
   * Get available subscription plans.
   */
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await localApi.get("/api/proxy/subscriptions/plans");
    return response.data || [];
  },

  /**
   * Get current user's active subscription.
   */
  getMySubscription: async (): Promise<UserSubscription> => {
    const response = await localApi.get("/api/proxy/subscriptions/me");
    return response.data;
  },

  /**
   * Subscribe to a premium tier plan.
   */
  subscribe: async (tier: "ADVANCE" | "PRO" | "ELITE", billingCycle: "MONTHLY" | "ANNUAL"): Promise<any> => {
    const response = await localApi.post("/api/proxy/subscriptions/subscribe", {
      tier,
      billingCycle,
    });
    return response.data;
  },

  /**
   * Cancel subscription at period end.
   */
  cancelSubscription: async (): Promise<any> => {
    const response = await localApi.post("/api/proxy/subscriptions/cancel");
    return response.data;
  },

  /**
   * Reactivate a pending cancellation.
   */
  reactivateSubscription: async (): Promise<any> => {
    const response = await localApi.post("/api/proxy/subscriptions/reactivate");
    return response.data;
  },

  /**
   * Get billing history (invoices).
   */
  getBillingHistory: async (page = 1, limit = 20): Promise<{ invoices: Invoice[]; total: number }> => {
    const response = await localApi.get("/api/proxy/subscriptions/billing/history", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get invoice details.
   */
  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await localApi.get(`/api/proxy/subscriptions/billing/invoices/${id}`);
    return response.data;
  },

  /**
   * List saved payment methods.
   */
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await localApi.get("/api/proxy/subscriptions/payment-methods");
    return response.data || [];
  },

  /**
   * Save a new payment method.
   */
  savePaymentMethod: async (payload: SavePaymentMethodPayload): Promise<PaymentMethod> => {
    const response = await localApi.post("/api/proxy/subscriptions/payment-methods", payload);
    return response.data;
  },

  /**
   * Set a default payment method.
   */
  setDefaultPaymentMethod: async (id: string): Promise<any> => {
    const response = await localApi.patch(`/api/proxy/subscriptions/payment-methods/${id}/default`);
    return response.data;
  },

  /**
   * Remove a saved payment method.
   */
  removePaymentMethod: async (id: string): Promise<any> => {
    const response = await localApi.delete(`/api/proxy/subscriptions/payment-methods/${id}`);
    return response.data;
  },
};

export default subscriptionService;
