import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export class AdminMarketplaceService {
  async getMarketplaceOverview(): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_MARKETPLACE.ROOT);
    return response.data?.data || response.data;
  }

  async getReports(): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_MARKETPLACE.REPORTS);
    return response.data?.data || response.data;
  }

  async getReportDetail(id: string): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_MARKETPLACE.REPORT_DETAIL(id));
    return response.data?.data || response.data;
  }

  async updateReportStatus(id: string, status: string): Promise<any> {
    const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN_MARKETPLACE.UPDATE_REPORT_STATUS(id), { status });
    return response.data?.data || response.data;
  }

  async createNote(note: string, targetId?: string): Promise<any> {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_MARKETPLACE.NOTES, { note, targetId });
    return response.data?.data || response.data;
  }

  async getAuditHistory(): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_MARKETPLACE.AUDIT);
    return response.data?.data || response.data;
  }

  async getCollaboratorDetail(id: string): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_MARKETPLACE.COLLABORATOR_DETAIL(id));
    return response.data?.data || response.data;
  }

  async moderateCollaborator(id: string, action: string, reason?: string): Promise<any> {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_MARKETPLACE.MODERATE_COLLABORATOR(id), { action, reason });
    return response.data?.data || response.data;
  }

  async moderateProject(id: string, action: string, reason?: string): Promise<any> {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_MARKETPLACE.MODERATE_PROJECT(id), { action, reason });
    return response.data?.data || response.data;
  }
}

export const adminMarketplaceService = new AdminMarketplaceService();
