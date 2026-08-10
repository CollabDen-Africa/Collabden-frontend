import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { SubscriptionPlan, UserSubscription, Invoice, PaymentMethod, SavePaymentMethodPayload } from "@/types/api.types";

const subscriptionService = {
  /**
   * Get available subscription plans.
   */
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTIONS.PLANS);
    return response.data?.data || response.data || [];
  },

  /**
   * Get current user's active subscription.
   */
  getMySubscription: async (): Promise<UserSubscription> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTIONS.ME);
    return response.data?.data || response.data;
  },

  /**
   * Subscribe to a premium tier plan.
   */
  subscribe: async (tier: "ADVANCE" | "PRO" | "ELITE", billingCycle: "MONTHLY" | "ANNUAL"): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.SUBSCRIPTIONS.SUBSCRIBE, {
      tier,
      billingCycle,
    });
    return response.data?.data || response.data;
  },

  /**
   * Cancel subscription at period end.
   */
  cancelSubscription: async (): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.SUBSCRIPTIONS.CANCEL);
    return response.data?.data || response.data;
  },

  /**
   * Reactivate a pending cancellation.
   */
  reactivateSubscription: async (): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.SUBSCRIPTIONS.REACTIVATE);
    return response.data?.data || response.data;
  },

  /**
   * Get billing history (invoices).
   */
  getBillingHistory: async (page = 1, limit = 20): Promise<{ invoices: Invoice[]; total: number }> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTIONS.BILLING_HISTORY, {
      params: { page, limit },
    });
    return response.data?.data || response.data;
  },

  /**
   * Get invoice details.
   */
  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTIONS.INVOICE(id));
    return response.data?.data || response.data;
  },

  /**
   * Download invoice PDF.
   */
  getInvoicePdf: async (id: string): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTIONS.INVOICE_PDF(id), { responseType: 'blob' });
    return response.data;
  },

  /**
   * List saved payment methods.
   */
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTIONS.PAYMENT_METHODS);
    return response.data?.data || response.data || [];
  },

  /**
   * Save a new payment method.
   */
  savePaymentMethod: async (payload: SavePaymentMethodPayload): Promise<PaymentMethod> => {
    const response = await axiosInstance.post(API_ENDPOINTS.SUBSCRIPTIONS.PAYMENT_METHODS, payload);
    return response.data?.data || response.data;
  },

  /**
   * Set a default payment method.
   */
  setDefaultPaymentMethod: async (id: string): Promise<any> => {
    const response = await axiosInstance.put(API_ENDPOINTS.SUBSCRIPTIONS.DEFAULT_PAYMENT_METHOD(id));
    return response.data?.data || response.data;
  },

  /**
   * Remove a saved payment method.
   */
  removePaymentMethod: async (id: string): Promise<any> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.SUBSCRIPTIONS.DELETE_PAYMENT_METHOD(id));
    return response.data?.data || response.data;
  },
};

export default subscriptionService;
