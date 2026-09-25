import axios from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  UserConnection,
  ConnectionRequestPayload,
  RespondConnectionPayload,
} from "@/types/api.types";

const connectionService = {
  /**
   * Send a connection request to a user.
   */
  sendRequest: async (data: ConnectionRequestPayload): Promise<UserConnection> => {
    // Browser requests use the app proxy so the HTTP-only auth cookie is forwarded
    // to the API. Keep the direct client for server-side callers and legacy token auth.
    if (typeof window !== "undefined") {
      try {
        const response = await axios.post("/api/proxy/user/connections/request", data);
        return response.data?.data?.connection || response.data?.connection || response.data;
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          throw error;
        }
      }
    }

    const response = await axiosInstance.post(API_ENDPOINTS.CONNECTIONS.SEND_REQUEST, data);
    return response.data?.data?.connection || response.data?.connection || response.data;
  },

  /**
   * Respond to an incoming connection request (Accept/Reject).
   */
  respondToRequest: async (id: string, data: RespondConnectionPayload): Promise<UserConnection> => {
    if (typeof window !== "undefined") {
      try {
        const response = await axios.put(`/api/proxy/user/connections/request/${id}`, data);
        return response.data?.data?.connection || response.data?.connection || response.data;
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          throw error;
        }
      }
    }

    const response = await axiosInstance.put(API_ENDPOINTS.CONNECTIONS.RESPOND_REQUEST(id), data);
    return response.data?.data?.connection || response.data?.connection || response.data;
  },

  /**
   * List all accepted connections.
   */
  getConnections: async (): Promise<{ id: string; email: string }[]> => {
    if (typeof window !== "undefined") {
      try {
        const response = await axios.get("/api/proxy/user/connections");
        return response.data?.data || response.data || [];
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          throw error;
        }
      }
    }

    const response = await axiosInstance.get(API_ENDPOINTS.CONNECTIONS.LIST);
    return response.data?.data || response.data || [];
  },

  /**
   * List all pending connection requests.
   */
  getPendingRequests: async (): Promise<UserConnection[]> => {
    if (typeof window !== "undefined") {
      try {
        const response = await axios.get("/api/proxy/user/connections/pending");
        return response.data?.data || response.data || [];
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          throw error;
        }
      }
    }

    const response = await axiosInstance.get(API_ENDPOINTS.CONNECTIONS.LIST_PENDING);
    return response.data?.data || response.data || [];
  },
};

export default connectionService;
