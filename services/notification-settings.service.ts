import { proxyAxios } from "@/lib/axios";
import { PROXY_ENDPOINTS } from "@/constants/api-endpoints";
import type { NotificationSetting, UpdateNotificationSettingsPayload } from "@/types/api.types";

const notificationSettingsService = {
  /**
   * Get notification settings for the authenticated user.
   */
  getNotificationSettings: async (): Promise<NotificationSetting> => {
    const response = await proxyAxios.get(PROXY_ENDPOINTS.NOTIFICATION_SETTINGS.ROOT);
    return response.data?.data || response.data;
  },

  /**
   * Update notification settings.
   */
  updateNotificationSettings: async (payload: UpdateNotificationSettingsPayload): Promise<NotificationSetting> => {
    const response = await proxyAxios.patch(PROXY_ENDPOINTS.NOTIFICATION_SETTINGS.ROOT, payload);
    return response.data?.data || response.data;
  },
};

export default notificationSettingsService;
