"use client";

import React, { useState, useEffect } from "react";
import { DashboardOverviewHeader } from "./DashboardOverviewHeader";
import { DashboardMetricGrid } from "./DashboardMetricGrid";
import { FinancialSummaryRow } from "./FinancialSummaryRow";
import { PendingActionsList } from "./PendingActionsList";
import { RecentActivityList } from "./RecentActivityList";
import {
  dashboardService,
  DashboardOverviewData,
  PendingActionsData,
  ActivityItem,
} from "@/services/admin/dashboard.service";
import { useAuth } from "@/context/AuthContext";

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<DashboardOverviewData>({});
  const [pendingActions, setPendingActions] = useState<PendingActionsData>({});
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [overviewData, pendingActionsData, recentActivities] = await Promise.all([
        dashboardService.getOverview(),
        dashboardService.getPendingActions(),
        dashboardService.getRecentActivities(),
      ]);
      setOverview(overviewData);
      setPendingActions(pendingActionsData);
      setActivities(recentActivities);
    } catch (error) {
      console.error("Error fetching admin dashboard overview:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  const adminName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.email?.split("@")[0] || "Administrator";

  return (
    <div className="w-full pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <DashboardOverviewHeader
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        adminName={adminName}
      />

      {/* Top KPI Metric Cards Grid */}
      <DashboardMetricGrid
        isLoading={isLoading}
        metrics={{
          totalUsers: overview.totalUsers,
          activeProjects: overview.activeProjects,
          pendingVerifications: overview.pendingActions?.identityVerificationRequests,
          openDisputes: overview.pendingActions?.openDisputes,
          supportTickets: overview.pendingActions?.supportTickets,
        }}
      />

      {/* Financial API endpoints are not available yet, so this section retains its approved mock UI. */}
      <FinancialSummaryRow isLoading={isLoading} />

      {/* Bottom 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PendingActionsList pendingActions={pendingActions} />
        <RecentActivityList activities={activities} />
      </div>
    </div>
  );
};

export default DashboardView;
