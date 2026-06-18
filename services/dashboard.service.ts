import { localApi } from "@/lib/axios";
import type { DashboardData, ApiResponse } from "@/types/api.types";

const dashboardService = {
  /**
   * Fetch aggregated dashboard data for the authenticated user.
   * Calls the local proxy which forwards to GET /api/v1/dashboard.
   */
  getDashboard: async (): Promise<DashboardData> => {
    const response = await localApi.get<ApiResponse<DashboardData>>("/api/proxy/dashboard");
    return response.data.data || response.data as unknown as DashboardData;
  },
};

export default dashboardService;
