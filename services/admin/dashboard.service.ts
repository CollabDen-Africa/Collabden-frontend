import { localApi } from "@/lib/axios";

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
    try {
      const response = await localApi.get("/api/proxy/dashboard/admin");
      return response.data?.data || response.data || {};
    } catch {
      return {};
    }
  },

  getPendingActions: async (): Promise<PendingActionsData> => {
    try {
      const response = await localApi.get("/api/proxy/dashboard/admin/pending-actions");
      return response.data?.data || response.data || {};
    } catch {
      return {};
    }
  },

  getRecentActivities: async (limit = 10): Promise<ActivityItem[]> => {
    try {
      const response = await localApi.get("/api/proxy/dashboard/admin/activities", {
        params: { limit },
      });
      return response.data?.data || (Array.isArray(response.data) ? response.data : []);
    } catch {
      return [];
    }
  },
};

export default dashboardService;
