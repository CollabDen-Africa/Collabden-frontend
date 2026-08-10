"use client";

import React from "react";
import { FiUsers, FiFolder, FiCheckSquare, FiShieldOff, FiHelpCircle, FiDollarSign } from "react-icons/fi";
import { StatCard } from "../shared/StatCard";
import { useRouter } from "next/navigation";

interface DashboardMetricGridProps {
  isLoading?: boolean;
  metrics?: {
    totalUsers?: number;
    activeProjects?: number;
    pendingVerifications?: number;
    openDisputes?: number;
    supportTickets?: number;
    escrowVolume?: number;
  };
}

export const DashboardMetricGrid: React.FC<DashboardMetricGridProps> = ({
  isLoading = false,
  metrics,
}) => {
  const router = useRouter();

  const totalUsers = metrics?.totalUsers ?? 24381;
  const activeProjects = metrics?.activeProjects ?? 1847;
  const pendingVerifications = metrics?.pendingVerifications ?? 142;
  const openDisputes = metrics?.openDisputes ?? 38;
  const supportTickets = metrics?.supportTickets ?? 91;
  const escrowVolume = metrics?.escrowVolume ?? 184320;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        label="Total Registered Users"
        value={totalUsers.toLocaleString()}
        badge="+12.4% this month"
        icon={<FiUsers size={20} />}
        color="bg-primary-green"
        isLoading={isLoading}
        onViewDetails={() => router.push("/admin/users")}
      />

      <StatCard
        label="Active Projects"
        value={activeProjects.toLocaleString()}
        badge="+8.1% this week"
        icon={<FiFolder size={20} />}
        color="bg-primary-green"
        isLoading={isLoading}
        onViewDetails={() => router.push("/admin/projects")}
      />

      <StatCard
        label="Pending Verifications"
        value={pendingVerifications.toLocaleString()}
        badge="+31 today"
        icon={<FiCheckSquare size={20} />}
        color="bg-primary-green"
        isLoading={isLoading}
        onViewDetails={() => router.push("/admin/users")}
      />

      <StatCard
        label="Open Disputes"
        value={openDisputes.toLocaleString()}
        badge="-5 resolved today"
        icon={<FiShieldOff size={20} />}
        color="bg-red-500"
        isRedAlert={true}
        isLoading={isLoading}
        onViewDetails={() => router.push("/admin/moderation")}
      />

      <StatCard
        label="Active Support Tickets"
        value={supportTickets.toLocaleString()}
        badge="7 critical"
        icon={<FiHelpCircle size={20} />}
        color="bg-red-500"
        isRedAlert={true}
        isLoading={isLoading}
        onViewDetails={() => router.push("/admin/support")}
      />

      <StatCard
        label="Escrow Transactions (24h)"
        value={`$${escrowVolume.toLocaleString()}`}
        badge="+22.3% vs last week"
        icon={<FiDollarSign size={20} />}
        color="bg-primary-green"
        isLoading={isLoading}
        onViewDetails={() => router.push("/admin/payments")}
      />
    </div>
  );
};

export default DashboardMetricGrid;
