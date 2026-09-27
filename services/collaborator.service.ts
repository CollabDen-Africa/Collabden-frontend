import axios from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { MarketplaceCollaborator } from "@/types/api.types";

const collaboratorService = {
  /**
   * Fetch all collaborator profiles for the marketplace with filters.
   */
  getCollaborators: async (params?: {
    name?: string;
    skills?: string;
    genres?: string;
    role?: string;
    openToCollaborate?: "true" | "false" | "all";
    connectedOnly?: boolean;
  }): Promise<MarketplaceCollaborator[]> => {
    const { connectedOnly, ...queryParams } = params || {};
    const proxyUrl = connectedOnly
      ? "/api/proxy/user/collaborators/connected"
      : "/api/proxy/user/collaborators";
    const directUrl = connectedOnly
      ? API_ENDPOINTS.COLLABORATORS.CONNECTED
      : API_ENDPOINTS.COLLABORATORS.LIST;

    if (typeof window !== "undefined") {
      const response = await axios.get(proxyUrl, { params: queryParams });
      return response.data?.data || response.data || [];
    }

    const response = await axiosInstance.get(directUrl, { params: queryParams });
    return response.data?.data || response.data || [];
  },

  /**
   * Retrieve list of all unique skills currently present in user profiles.
   */
  listSkills: async (): Promise<string[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.COLLABORATORS.SKILLS);
    return response.data?.data || response.data || [];
  },

  /**
   * Retrieve list of all unique genres currently present in user profiles.
   */
  listGenres: async (): Promise<string[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.COLLABORATORS.GENRES);
    return response.data?.data || response.data || [];
  },

  /**
   * Update collaborator availability status.
   */
  updateAvailability: async (openToCollaborate: boolean): Promise<any> => {
    const payload = { openToCollaborate };

    if (typeof window !== "undefined") {
      try {
        const response = await axios.patch(
          "/api/proxy/user/collaborators/availability",
          payload,
        );
        return response.data?.data || response.data;
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          throw error;
        }
      }
    }

    const response = await axiosInstance.patch(API_ENDPOINTS.COLLABORATORS.AVAILABILITY, payload);
    return response.data?.data || response.data;
  },

  /**
   * Get detailed collaborator profile by user ID.
   */
  getCollaboratorById: async (userId: string): Promise<MarketplaceCollaborator> => {
    const response = await axiosInstance.get(API_ENDPOINTS.COLLABORATORS.DETAIL(userId));
    return response.data?.data || response.data;
  },
};

export default collaboratorService;
