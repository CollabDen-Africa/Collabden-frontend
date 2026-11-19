import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import subscriptionService from "@/services/subscription.service";
import { SavePaymentMethodPayload } from "@/types/api.types";

export const useSubscription = () => {
  const queryClient = useQueryClient();

  const usePlans = () =>
    useQuery({
      queryKey: ["subscriptions", "plans"],
      queryFn: () => subscriptionService.getPlans(),
      meta: { errorContext: "subscription.load"},
    });

  const useMySubscription = () =>
    useQuery({
      queryKey: ["subscriptions", "me"],
      queryFn: () => subscriptionService.getMySubscription(),
    });

  const useSubscribe = () =>
    useMutation({
      mutationFn: ({ tier, billingCycle }: { tier: "ADVANCE" | "PRO" | "ELITE"; billingCycle: "MONTHLY" | "ANNUAL" }) =>
        subscriptionService.subscribe(tier, billingCycle),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "me"] });
      },
      meta: { errorContext: "subscription.subscribe"},
    });

  const useCancelSubscription = () =>
    useMutation({
      mutationFn: () => subscriptionService.cancelSubscription(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "me"] });
      },
      meta: { errorContext: "subscription.cancel"},
    });

  const useReactivateSubscription = () =>
    useMutation({
      mutationFn: () => subscriptionService.reactivateSubscription(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "me"] });
      },
      meta: { errorContext: "subscription.reactivate"},
    });

  const useBillingHistory = (page = 1, limit = 20) =>
    useQuery({
      queryKey: ["subscriptions", "billing-history", page, limit],
      queryFn: () => subscriptionService.getBillingHistory(page, limit),
      meta: { errorContext: "subscription.load"},
    });

  const usePaymentMethods = () =>
    useQuery({
      queryKey: ["subscriptions", "payment-methods"],
      queryFn: () => subscriptionService.getPaymentMethods(),
      meta: { errorContext: "paymentMethods.load"},
    });

  const useSavePaymentMethod = () =>
    useMutation({
      mutationFn: (payload: SavePaymentMethodPayload) =>
        subscriptionService.savePaymentMethod(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "payment-methods"] });
      },
      meta: { errorContext: "paymentMethods.save"},
    });

  const useSetDefaultPaymentMethod = () =>
    useMutation({
      mutationFn: (id: string) => subscriptionService.setDefaultPaymentMethod(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "payment-methods"] });
      },
     meta: { errorContext: "paymentMethods.setDefault"},
    });

  const useRemovePaymentMethod = () =>
    useMutation({
      mutationFn: (id: string) => subscriptionService.removePaymentMethod(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "payment-methods"] });
      },
      meta: { errorContext: "paymentMethods.remove"},
    });

  return {
    usePlans,
    useMySubscription,
    useSubscribe,
    useCancelSubscription,
    useReactivateSubscription,
    useBillingHistory,
    usePaymentMethods,
    useSavePaymentMethod,
    useSetDefaultPaymentMethod,
    useRemovePaymentMethod,
  };
};
