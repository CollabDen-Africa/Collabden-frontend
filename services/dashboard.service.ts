import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { DashboardData, ApiResponse } from "@/types/api.types";

const dashboardService = {
  /**
   * Fetch aggregated dashboard data for the authenticated user.
   */
  getDashboard: async (): Promise<DashboardData> => {
    const response = await axiosInstance.get<ApiResponse<DashboardData>>(API_ENDPOINTS.DASHBOARD.ROOT);
    return response.data.data || (response.data as unknown as DashboardData);
  },
};

export default dashboardService;
