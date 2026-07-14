import { localApi } from "@/lib/axios";
import type { NotificationSetting, UpdateNotificationSettingsPayload } from "@/types/api.types";

const notificationSettingsService = {
  /**
   * Get notification settings for the authenticated user.
   */
  getNotificationSettings: async (): Promise<NotificationSetting> => {
    const response = await localApi.get("/api/proxy/notification-settings");
    // The backend wraps it in { success: true, data: NotificationSetting }
    return response.data?.data || response.data;
  },

  /**
   * Update notification settings.
   */
  updateNotificationSettings: async (payload: UpdateNotificationSettingsPayload): Promise<NotificationSetting> => {
    const response = await localApi.patch("/api/proxy/notification-settings", payload);
    return response.data?.data || response.data;
  },
};

export default notificationSettingsService;
