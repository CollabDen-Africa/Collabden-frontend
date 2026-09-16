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
  };
}

export const DashboardMetricGrid: React.FC<DashboardMetricGridProps> = ({
  isLoading = false,
  metrics,
}) => {
  const router = useRouter();

  const displayCount = (value?: number) =>
    typeof value === "number" ? value.toLocaleString() : "—";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        label="Total Registered Users"
        value={displayCount(metrics?.totalUsers)}
        icon={<FiUsers size={20} />}
        color="bg-primary-green"
        isLoading={isLoading}
        onViewDetails={() => router.push("/admin/users")}
      />

      <StatCard
        label="Active Projects"
        value={displayCount(metrics?.activeProjects)}
        icon={<FiFolder size={20} />}
        color="bg-primary-green"
        isLoading={isLoading}
        onViewDetails={() => router.push("/admin/projects")}
      />

      <StatCard
        label="Pending Verifications"
        value={displayCount(metrics?.pendingVerifications)}
        icon={<FiCheckSquare size={20} />}
        color="bg-primary-green"
        isLoading={isLoading}
        onViewDetails={() => router.push("/admin/users")}
      />

      <StatCard
        label="Open Disputes"
        value={displayCount(metrics?.openDisputes)}
        icon={<FiShieldOff size={20} />}
        color="bg-red-500"
        isRedAlert={true}
        isLoading={isLoading}
        onViewDetails={() => router.push("/admin/moderation")}
      />

      <StatCard
        label="Active Support Tickets"
        value={displayCount(metrics?.supportTickets)}
        icon={<FiHelpCircle size={20} />}
        color="bg-red-500"
        isRedAlert={true}
        isLoading={isLoading}
        onViewDetails={() => router.push("/admin/support")}
      />

      <StatCard
        label="Escrow Transactions (24h)"
        value="$184,320"
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
