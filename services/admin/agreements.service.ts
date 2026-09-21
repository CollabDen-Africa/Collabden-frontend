import axios from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

const ADMIN_AGREEMENTS_PROXY = "/api/proxy/admin/agreements";

const adminProxyGet = async (
  path: string,
  params?: Record<string, unknown>
) => {
  const response = await axios.get(path, { params, withCredentials: true });
  return response.data?.data || response.data;
};

export class AdminAgreementsService {
  async getAgreements(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<any> {
    return adminProxyGet(ADMIN_AGREEMENTS_PROXY, params);
  }

  async getReports(): Promise<any> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.ADMIN_AGREEMENTS.REPORTS
    );
    return response.data?.data || response.data;
  }

  async getReportDetail(id: string): Promise<any> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.ADMIN_AGREEMENTS.REPORT_DETAIL(id)
    );
    return response.data?.data || response.data;
  }

  async updateReportStatus(id: string, status: string): Promise<any> {
    const response = await axiosInstance.patch(
      API_ENDPOINTS.ADMIN_AGREEMENTS.UPDATE_REPORT_STATUS(id),
      { status }
    );
    return response.data?.data || response.data;
  }

  async createNote(note: string, agreementId?: string): Promise<any> {
    const response = await axiosInstance.post(
      API_ENDPOINTS.ADMIN_AGREEMENTS.NOTES,
      { note, agreementId }
    );
    return response.data?.data || response.data;
  }

  async getAuditHistory(): Promise<any> {
    const response = await axiosInstance.get(
      API_ENDPOINTS.ADMIN_AGREEMENTS.AUDIT
    );
    return response.data?.data || response.data;
  }

  async getAgreementDetail(id: string): Promise<any> {
    return adminProxyGet(`${ADMIN_AGREEMENTS_PROXY}/${id}`);
  }

  async getAgreementActivity(id: string): Promise<any> {
    return adminProxyGet(`${ADMIN_AGREEMENTS_PROXY}/${id}/activity`);
  }
}

export const adminAgreementsService = new AdminAgreementsService();
