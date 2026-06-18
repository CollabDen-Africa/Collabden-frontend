import { localApi } from "@/lib/axios";
import type { Notification, ApiResponse } from "@/types/api.types";

const notificationService = {
  /**
   * Fetch all notifications for the authenticated user.
   * Returns notifications ordered by most recent first.
   */
  getAll: async (): Promise<Notification[]> => {
    const response = await localApi.get<ApiResponse<Notification[]>>("/api/proxy/notifications");
    // Handle both { data: [...] } and direct array response
    const raw = response.data;
    if (Array.isArray(raw)) return raw;
    if (raw.data && Array.isArray(raw.data)) return raw.data;
    return [];
  },

  /**
   * Mark all notifications as read for the authenticated user.
   */
  markAllRead: async (): Promise<void> => {
    await localApi.patch("/api/proxy/notifications/read-all");
  },

  /**
   * Mark a single notification as read by ID.
   */
  markOneRead: async (id: string): Promise<Notification> => {
    const response = await localApi.patch<ApiResponse<Notification>>(
      `/api/proxy/notifications/${id}/read`
    );
    return response.data.data || response.data as unknown as Notification;
  },
};

export default notificationService;
