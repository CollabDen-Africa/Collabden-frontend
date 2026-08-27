import { useState, useCallback, useEffect } from "react";
import {
  adminSubscriptionsService,
  SubscriptionIssueItem,
} from "@/services/admin/subscriptions.service";

export function useAdminSubscriptionIssues() {
  const [issues, setIssues] = useState<SubscriptionIssueItem[]>([]);
  const [failedPayments, setFailedPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchIssues = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminSubscriptionsService.getSubscriptionIssues();
      setIssues(data.issues);
      setFailedPayments(data.failedPayments);
    } catch (err) {
      console.error("Failed to load subscription issues:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleRetryPayment = async (id: string) => {
    setIsActionLoading(true);
    try {
      await adminSubscriptionsService.retryFailedPayment(id);
      await fetchIssues();
      return true;
    } catch (err) {
      console.error("Retry payment error:", err);
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSaveNote = async (id: string, note: string) => {
    setIsActionLoading(true);
    try {
      await adminSubscriptionsService.saveAdminNote(id, note);
      setIssues((prev) =>
        prev.map((iss) => (iss.id === id ? { ...iss, investigationNote: note } : iss))
      );
      return true;
    } catch (err) {
      console.error("Save note error:", err);
      return false;
    } font: {
      setIsActionLoading(false);
    }
  };

  return {
    issues,
    failedPayments,
    isLoading,
    isActionLoading,
    handleRetryPayment,
    handleSaveNote,
    refetch: fetchIssues,
  };
}

export default useAdminSubscriptionIssues;
