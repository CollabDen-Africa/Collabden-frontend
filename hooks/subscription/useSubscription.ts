import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import subscriptionService from "@/services/subscription.service";
import { SavePaymentMethodPayload } from "@/types/api.types";
import { handleApiError } from "@/lib/error-handler";

export const useSubscription = () => {
  const queryClient = useQueryClient();

  const usePlans = () =>
    useQuery({
      queryKey: ["subscriptions", "plans"],
      queryFn: () => subscriptionService.getPlans(),
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
      onError: (error) => handleApiError(error),
    });

  const useCancelSubscription = () =>
    useMutation({
      mutationFn: () => subscriptionService.cancelSubscription(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "me"] });
      },
      onError: (error) => handleApiError(error),
    });

  const useReactivateSubscription = () =>
    useMutation({
      mutationFn: () => subscriptionService.reactivateSubscription(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "me"] });
      },
      onError: (error) => handleApiError(error),
    });

  const useBillingHistory = (page = 1, limit = 20) =>
    useQuery({
      queryKey: ["subscriptions", "billing-history", page, limit],
      queryFn: () => subscriptionService.getBillingHistory(page, limit),
    });

  const usePaymentMethods = () =>
    useQuery({
      queryKey: ["subscriptions", "payment-methods"],
      queryFn: () => subscriptionService.getPaymentMethods(),
    });

  const useSavePaymentMethod = () =>
    useMutation({
      mutationFn: (payload: SavePaymentMethodPayload) =>
        subscriptionService.savePaymentMethod(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "payment-methods"] });
      },
      onError: (error) => handleApiError(error),
    });

  const useSetDefaultPaymentMethod = () =>
    useMutation({
      mutationFn: (id: string) => subscriptionService.setDefaultPaymentMethod(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "payment-methods"] });
      },
      onError: (error) => handleApiError(error),
    });

  const useRemovePaymentMethod = () =>
    useMutation({
      mutationFn: (id: string) => subscriptionService.removePaymentMethod(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subscriptions", "payment-methods"] });
      },
      onError: (error) => handleApiError(error),
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
