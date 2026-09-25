import axios from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { Notification, ApiResponse } from "@/types/api.types";

const notificationService = {
  /**
   * Fetch all notifications for the authenticated user.
   */
  getAll: async (): Promise<Notification[]> => {
    let response;

    if (typeof window !== "undefined") {
      try {
        response = await axios.get<ApiResponse<Notification[]>>("/api/proxy/notifications");
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          throw error;
        }
      }
    }

    response ??= await axiosInstance.get<ApiResponse<Notification[]>>(API_ENDPOINTS.NOTIFICATIONS.LIST);
    const raw = response.data;
    if (Array.isArray(raw)) return raw;
    if (raw.data && Array.isArray(raw.data)) return raw.data;
    return [];
  },

  /**
   * Mark all notifications as read for the authenticated user.
   */
  markAllRead: async (): Promise<void> => {
    if (typeof window !== "undefined") {
      try {
        await axios.patch("/api/proxy/notifications/read-all");
        return;
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          throw error;
        }
      }
    }

    await axiosInstance.put(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
  },

  /**
   * Mark a single notification as read by ID.
   */
  markOneRead: async (id: string): Promise<Notification> => {
    let response;

    if (typeof window !== "undefined") {
      try {
        response = await axios.patch<ApiResponse<Notification>>(
          `/api/proxy/notifications/${id}/read`,
        );
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          throw error;
        }
      }
    }

    response ??= await axiosInstance.patch<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.READ_ONE(id),
    );
    return response.data.data || (response.data as unknown as Notification);
  },
};

export default notificationService;
