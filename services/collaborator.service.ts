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
  }): Promise<MarketplaceCollaborator[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.COLLABORATORS.LIST, { params });
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
    const response = await axiosInstance.patch(API_ENDPOINTS.COLLABORATORS.AVAILABILITY, {
      openToCollaborate,
    });
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
