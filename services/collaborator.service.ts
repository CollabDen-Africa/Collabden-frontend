import { proxyAxios } from "@/lib/axios";
import { PROXY_ENDPOINTS } from "@/constants/api-endpoints";
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
    const url = connectedOnly
      ? PROXY_ENDPOINTS.COLLABORATORS.CONNECTED
      : PROXY_ENDPOINTS.COLLABORATORS.LIST;

    const response = await proxyAxios.get(url, { params: queryParams });
    return response.data?.data || response.data || [];
  },

  /**
   * Retrieve list of all unique skills currently present in user profiles.
   */
  listSkills: async (): Promise<string[]> => {
    const response = await proxyAxios.get(PROXY_ENDPOINTS.COLLABORATORS.SKILLS);
    return response.data?.data || response.data || [];
  },

  /**
   * Retrieve list of all unique genres currently present in user profiles.
   */
  listGenres: async (): Promise<string[]> => {
    const response = await proxyAxios.get(PROXY_ENDPOINTS.COLLABORATORS.GENRES);
    return response.data?.data || response.data || [];
  },

  /**
   * Update collaborator availability status.
   */
  updateAvailability: async (openToCollaborate: boolean): Promise<any> => {
    const payload = { openToCollaborate };
    const response = await proxyAxios.patch(PROXY_ENDPOINTS.COLLABORATORS.AVAILABILITY, payload);
    return response.data?.data || response.data;
  },

  /**
   * Get detailed collaborator profile by user ID.
   */
  getCollaboratorById: async (userId: string): Promise<MarketplaceCollaborator> => {
    const response = await proxyAxios.get(PROXY_ENDPOINTS.COLLABORATORS.DETAIL(userId));
    return response.data?.data || response.data;
  },
};

export default collaboratorService;
