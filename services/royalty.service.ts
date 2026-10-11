import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { RoyaltySettingsResponse, UpdateRoyaltySplitInput } from "@/types/royalty.types";

const royaltyService = {
  /**
   * Get royalty splits for a project.
   */
  getProjectSplits: async (projectId: string): Promise<RoyaltySettingsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ROYALTIES.SPLITS(projectId));
    return response.data?.data || response.data;
  },

  /**
   * Configure / update royalty splits for a project (Owner only).
   */
  updateProjectSplits: async (
    projectId: string, 
    splitsData: UpdateRoyaltySplitInput[]
  ): Promise<RoyaltySettingsResponse> => {
    const response = await axiosInstance.put(API_ENDPOINTS.ROYALTIES.SPLITS(projectId), { 
      splitsData 
    });
    return response.data?.data || response.data;
  }
};

export default royaltyService;