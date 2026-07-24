import { localApi } from "@/lib/axios";

export interface AdminDashboardOverviewData {
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

export interface AdminPendingActionsData {
  identityVerificationRequests?: Array<any>;
  openDisputes?: Array<any>;
  supportTickets?: Array<any>;
  reportedItems?: Array<any>;
}

export interface AdminActivityItem {
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

export const adminDashboardService = {
  getOverview: async (): Promise<AdminDashboardOverviewData> => {
    try {
      const response = await localApi.get("/api/proxy/dashboard/admin");
      return response.data?.data || response.data || {};
    } catch {
      return {};
    }
  },

  getPendingActions: async (): Promise<AdminPendingActionsData> => {
    try {
      const response = await localApi.get("/api/proxy/dashboard/admin/pending-actions");
      return response.data?.data || response.data || {};
    } catch {
      return {};
    }
  },

  getRecentActivities: async (limit = 10): Promise<AdminActivityItem[]> => {
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

export default adminDashboardService;
