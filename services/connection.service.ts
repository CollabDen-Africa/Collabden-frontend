import { localApi } from "@/lib/axios";
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
    const response = await localApi.post("/api/proxy/user/connections/request", data);
    return response.data.connection || response.data;
  },

  /**
   * Respond to an incoming connection request (Accept/Reject).
   */
  respondToRequest: async (id: string, data: RespondConnectionPayload): Promise<UserConnection> => {
    const response = await localApi.put(`/api/proxy/user/connections/request/${id}`, data);
    return response.data.connection || response.data;
  },

  /**
   * List all accepted connections.
   * Returns: list of accepted collaborator profiles ({ id: string, email: string }[])
   */
  getConnections: async (): Promise<{ id: string; email: string }[]> => {
    const response = await localApi.get("/api/proxy/user/connections");
    return response.data || [];
  },

  /**
   * List all pending connection requests.
   * Returns: list of pending UserConnection objects
   */
  getPendingRequests: async (): Promise<UserConnection[]> => {
    const response = await localApi.get("/api/proxy/user/connections/pending");
    return response.data || [];
  },
};

export default connectionService;
