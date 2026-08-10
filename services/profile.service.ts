import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

const profileService = {
  /**
   * Update profile info.
   */
  updateProfile: async (data: any): Promise<any> => {
    const response = await axiosInstance.put(API_ENDPOINTS.PROFILE.UPDATE, data);
    return response.data?.data || response.data;
  },

  /**
   * Update account email.
   */
  updateEmail: async (data: { newEmail: string; currentPassword: string }): Promise<any> => {
    const response = await axiosInstance.patch(API_ENDPOINTS.PROFILE.EMAIL, data);
    return response.data?.data || response.data;
  },

  /**
   * Update or remove phone number.
   */
  updatePhone: async (phoneNumber: string | null): Promise<any> => {
    const response = await axiosInstance.patch(API_ENDPOINTS.PROFILE.PHONE, { phoneNumber });
    return response.data?.data || response.data;
  },

  /**
   * Change user password.
   */
  changePassword: async (data: any): Promise<any> => {
    const response = await axiosInstance.patch(API_ENDPOINTS.PROFILE.PASSWORD, data);
    return response.data?.data || response.data;
  },

  /**
   * Update profile avatar URL.
   */
  updateAvatar: async (avatarUrl: string): Promise<any> => {
    const response = await axiosInstance.patch(API_ENDPOINTS.PROFILE.AVATAR, { avatarUrl });
    return response.data?.data || response.data;
  },

  /**
   * Get user profile completeness status.
   */
  getCompleteness: async (): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROFILE.COMPLETENESS);
    return response.data?.data || response.data;
  },

  /**
   * Browse collaborators open to collaboration.
   */
  browseCollaborators: async (params: {
    skills?: string;
    genres?: string;
    q?: string;
  }): Promise<any[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROFILE.BROWSE, { params });
    return response.data?.data || response.data || [];
  },

  /**
   * Get profile details by user ID.
   */
  getProfile: async (userId: string): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROFILE.DETAIL(userId));
    return response.data?.data || response.data;
  },

  /**
   * Add profile endorsement.
   */
  addEndorsement: async (userId: string, content: string): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.PROFILE.ENDORSE(userId), {
      content,
    });
    return response.data?.data || response.data;
  },

  /**
   * Get user portfolio.
   */
  getPortfolio: async (userId: string): Promise<any> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROFILE.PORTFOLIO(userId));
    return response.data?.data || response.data;
  },

  /**
   * Update portfolio entry for a project.
   */
  updatePortfolioEntry: async (projectId: string, data: any): Promise<any> => {
    const response = await axiosInstance.put(API_ENDPOINTS.PROFILE.UPDATE_PORTFOLIO(projectId), data);
    return response.data?.data || response.data;
  },

  /**
   * Add a project-specific collaborator endorsement.
   */
  addProjectEndorsement: async (projectId: string, data: any): Promise<any> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PROFILE.PROJECT_ENDORSEMENT(projectId),
      data
    );
    return response.data?.data || response.data;
  },
};

export default profileService;
