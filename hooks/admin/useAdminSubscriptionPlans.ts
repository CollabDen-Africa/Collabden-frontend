import { useState, useCallback, useEffect } from "react";
import {
  adminSubscriptionsService,
  SubscriptionPlanCardData,
  PlanChangeLogItem,
} from "@/services/admin/subscriptions.service";

export function useAdminSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlanCardData[]>([]);
  const [changeLogs, setChangeLogs] = useState<PlanChangeLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminSubscriptionsService.getSubscriptionPlans();
      setPlans(data.plans);
      setChangeLogs(data.changeLogs);
    } catch (err) {
      console.error("Failed to load subscription plans:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    changeLogs,
    isLoading,
    refetch: fetchPlans,
  };
}

export default useAdminSubscriptionPlans;
