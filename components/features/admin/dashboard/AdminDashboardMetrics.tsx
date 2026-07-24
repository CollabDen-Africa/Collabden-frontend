"use client";

import React from "react";
import { FiUsers, FiCalendar, FiRefreshCw } from "react-icons/fi";
import { AdminStatCard } from "../shared/AdminStatCard";

interface AdminDashboardMetricsProps {
  isLoading: boolean;
  stats: {
    total: number;
    today: number;
  };
}

export const AdminDashboardMetrics: React.FC<AdminDashboardMetricsProps> = ({
  isLoading,
  stats,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminStatCard
        label="Total Waitlist Users"
        value={stats.total}
        subtitle="All-time early access signups"
        icon={<FiUsers size={20} className="text-primary-blue" />}
        color="bg-primary-blue"
        isLoading={isLoading}
      />

      <AdminStatCard
        label="Signups Today (24h)"
        value={stats.today}
        subtitle="New requests in last 24 hours"
        icon={<FiCalendar size={20} className="text-primary-green" />}
        color="bg-primary-green"
        isLoading={isLoading}
      />

      <AdminStatCard
        label="Database Sync"
        value="Active"
        subtitle="Synced with real-time server database"
        icon={<FiRefreshCw size={20} className="text-yellow-500 animate-spin-slow" />}
        color="bg-yellow-500"
        isLoading={false}
      />
    </div>
  );
};

export default AdminDashboardMetrics;
