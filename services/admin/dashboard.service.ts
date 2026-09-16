import axiosInstance from "@/lib/axios";

const adminDashboardProxy = (path = "") => `/api/proxy/dashboard/admin${path}`;

const localProxyConfig = {
  baseURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
};

export interface DashboardOverviewData {
  totalUsers?: number;
  activeUsers?: number;
  totalProjects?: number;
  activeProjects?: number;
  pendingActions?: {
    identityVerificationRequests?: number;
    openDisputes?: number;
    supportTickets?: number;
    reportedItems?: number;
  };
}

export interface PendingActionsData {
  identityVerificationRequests?: Array<any>;
  openDisputes?: Array<any>;
  supportTickets?: Array<any>;
  reportedItems?: Array<any>;
}

export interface ActivityItem {
  id: string;
  action: string;
  details?: any;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    displayName?: string;
  };
}

export const dashboardService = {
  getOverview: async (): Promise<DashboardOverviewData> => {
    const response = await axiosInstance.get(adminDashboardProxy(), localProxyConfig);
    return response.data?.data || response.data || {};
  },

  getPendingActions: async (): Promise<PendingActionsData> => {
    try {
      const response = await axiosInstance.get(
        adminDashboardProxy("/pending-actions"),
        localProxyConfig,
      );
      return response.data?.data || response.data || {};
    } catch {
      return {};
    }
  },

  getRecentActivities: async (limit = 10): Promise<ActivityItem[]> => {
    try {
      const response = await axiosInstance.get(adminDashboardProxy("/activities"), {
        ...localProxyConfig,
        params: { limit },
      });
      return response.data?.data || (Array.isArray(response.data) ? response.data : []);
    } catch {
      return [];
    }
  },
};

export default dashboardService;
