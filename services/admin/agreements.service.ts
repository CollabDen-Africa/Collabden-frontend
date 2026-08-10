import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export class AdminAgreementsService {
  async getAgreementsOverview(): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AGREEMENTS.ROOT);
    return response.data?.data || response.data;
  }

  async getReports(): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AGREEMENTS.REPORTS);
    return response.data?.data || response.data;
  }

  async getReportDetail(id: string): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AGREEMENTS.REPORT_DETAIL(id));
    return response.data?.data || response.data;
  }

  async updateReportStatus(id: string, status: string): Promise<any> {
    const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN_AGREEMENTS.UPDATE_REPORT_STATUS(id), { status });
    return response.data?.data || response.data;
  }

  async createNote(note: string, agreementId?: string): Promise<any> {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_AGREEMENTS.NOTES, { note, agreementId });
    return response.data?.data || response.data;
  }

  async getAuditHistory(): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AGREEMENTS.AUDIT);
    return response.data?.data || response.data;
  }

  async getAgreementDetail(id: string): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AGREEMENTS.DETAIL(id));
    return response.data?.data || response.data;
  }

  async getAgreementActivity(id: string): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AGREEMENTS.ACTIVITY(id));
    return response.data?.data || response.data;
  }
}

export const adminAgreementsService = new AdminAgreementsService();
