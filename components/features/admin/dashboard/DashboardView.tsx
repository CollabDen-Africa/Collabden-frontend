"use client";

import React, { useState, useEffect } from "react";
import { DashboardOverviewHeader } from "./DashboardOverviewHeader";
import { DashboardMetricGrid } from "./DashboardMetricGrid";
import { FinancialSummaryRow } from "./FinancialSummaryRow";
import { PendingActionsList } from "./PendingActionsList";
import { RecentActivityList } from "./RecentActivityList";
import { dashboardService, DashboardOverviewData } from "@/services/admin/dashboard.service";
import { useAuth } from "@/context/AuthContext";

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<DashboardOverviewData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getOverview();
      setOverview(data);
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
    : "Super Admin";

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

      {/* Financial Summary Mini Grid */}
      <FinancialSummaryRow isLoading={isLoading} />

      {/* Bottom 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PendingActionsList />
        <RecentActivityList />
      </div>
    </div>
  );
};

export default DashboardView;
