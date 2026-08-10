import { localApi } from "@/lib/axios";

const profileService = {
  /**
   * Update profile info.
   */
  updateProfile: async (data: any): Promise<any> => {
    const response = await localApi.put("/api/proxy/user/profile", data);
    return response.data;
  },

  /**
   * Update account email.
   */
  updateEmail: async (data: { newEmail: string; currentPassword: string }): Promise<any> => {
    const response = await localApi.patch("/api/proxy/user/profile/email", data);
    return response.data;
  },

  /**
   * Update or remove phone number.
   */
  updatePhone: async (phoneNumber: string | null): Promise<any> => {
    const response = await localApi.patch("/api/proxy/user/profile/phone", { phoneNumber });
    return response.data;
  },

  /**
   * Change user password.
   */
  changePassword: async (data: any): Promise<any> => {
    const response = await localApi.patch("/api/proxy/user/profile/password", data);
    return response.data;
  },

  /**
   * Update profile avatar URL.
   */
  updateAvatar: async (avatarUrl: string): Promise<any> => {
    const response = await localApi.patch("/api/proxy/user/profile/avatar", { avatarUrl });
    return response.data;
  },

  /**
   * Get user profile completeness status.
   */
  getCompleteness: async (): Promise<any> => {
    const response = await localApi.get("/api/proxy/user/profile/completeness");
    return response.data;
  },

  /**
   * Browse collaborators open to collaboration.
   */
  browseCollaborators: async (params: {
    skills?: string;
    genres?: string;
    q?: string;
  }): Promise<any[]> => {
    const response = await localApi.get("/api/proxy/user/profile/browse", { params });
    return response.data || [];
  },

  /**
   * Get profile details by user ID.
   */
  getProfile: async (userId: string): Promise<any> => {
    const response = await localApi.get(`/api/proxy/user/profile/${userId}`);
    return response.data;
  },

  /**
   * Add profile endorsement.
   */
  addEndorsement: async (userId: string, content: string): Promise<any> => {
    const response = await localApi.post(`/api/proxy/user/profile/${userId}/endorsements`, {
      content,
    });
    return response.data;
  },

  /**
   * Get user portfolio.
   */
  getPortfolio: async (userId: string): Promise<any> => {
    const response = await localApi.get(`/api/proxy/user/profile/portfolio/${userId}`);
    return response.data;
  },

  /**
   * Update portfolio entry for a project.
   */
  updatePortfolioEntry: async (projectId: string, data: any): Promise<any> => {
    const response = await localApi.put(`/api/proxy/user/profile/portfolio/${projectId}`, data);
    return response.data;
  },

  /**
   * Add a project-specific collaborator endorsement.
   */
  addProjectEndorsement: async (projectId: string, data: any): Promise<any> => {
    const response = await localApi.post(
      `/api/proxy/user/profile/portfolio/${projectId}/endorsements`,
      data
    );
    return response.data;
  },
};

export default profileService;
