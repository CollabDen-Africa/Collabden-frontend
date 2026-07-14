import { localApi } from "@/lib/axios";
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
    const response = await localApi.get("/api/proxy/user/collaborators", { params });
    return response.data || [];
  },

  /**
   * Retrieve list of all unique skills currently present in user profiles.
   */
  listSkills: async (): Promise<string[]> => {
    const response = await localApi.get("/api/proxy/user/collaborators/skills");
    return response.data || [];
  },

  /**
   * Retrieve list of all unique genres currently present in user profiles.
   */
  listGenres: async (): Promise<string[]> => {
    const response = await localApi.get("/api/proxy/user/collaborators/genres");
    return response.data || [];
  },

  /**
   * Update collaborator availability status.
   */
  updateAvailability: async (openToCollaborate: boolean): Promise<any> => {
    const response = await localApi.patch("/api/proxy/user/collaborators/availability", {
      openToCollaborate,
    });
    return response.data;
  },

  /**
   * Get detailed collaborator profile by user ID.
   */
  getCollaboratorById: async (userId: string): Promise<MarketplaceCollaborator> => {
    const response = await localApi.get(`/api/proxy/user/collaborators/${userId}`);
    return response.data;
  },
};

export default collaboratorService;
