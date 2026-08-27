import { useState, useCallback, useEffect } from "react";
import {
  adminSubscriptionsService,
  SubscriptionDetailData,
} from "@/services/admin/subscriptions.service";

export function useAdminSubscriptionDetail(subscriptionId: string) {
  const [detail, setDetail] = useState<SubscriptionDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    if (!subscriptionId) return;
    setIsLoading(true);
    try {
      const data = await adminSubscriptionsService.getSubscriptionDetail(subscriptionId);
      setDetail(data);
    } catch (err) {
      console.error("Failed to load subscription detail:", err);
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    detail,
    isLoading,
    refetch: fetchDetail,
  };
}

export default useAdminSubscriptionDetail;
