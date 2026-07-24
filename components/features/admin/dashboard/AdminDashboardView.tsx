"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { AdminDashboardMetrics } from "./AdminDashboardMetrics";
import { AdminOverviewCharts } from "./AdminOverviewCharts";

interface WaitlistEntry {
  id: string;
  name?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  email: string;
  createdAt: string;
}

export const AdminDashboardView: React.FC = () => {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const response = await fetch("/api/proxy/waitlist");
        if (response.ok) {
          const data = await response.json();
          setWaitlist(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("Error fetching waitlist stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWaitlist();
  }, []);

  const stats = useMemo(() => {
    const total = waitlist.length;
    const oneDayAgo = Date.now() - 24 * 3600 * 1000;
    const todayCount = waitlist.filter(
      (entry) => new Date(entry.createdAt).getTime() > oneDayAgo
    ).length;

    return {
      total,
      today: todayCount,
    };
  }, [waitlist]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Panel */}
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Welcome to the Admin Dashboard
          </h1>
          <p className="text-white/50 text-sm md:text-base font-medium max-w-xl">
            Select the Users, Waitlist, or Verification tab in the sidebar to inspect detailed platform data.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 p-4 rounded-2xl bg-primary-green/10 border border-primary-green/20 text-primary-green">
          <FiCheckCircle size={24} />
          <span className="text-sm font-semibold tracking-wide">Secure Console Online</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <AdminDashboardMetrics isLoading={isLoading} stats={stats} />

      {/* Analytics Chart */}
      <AdminOverviewCharts />
    </div>
  );
};

export default AdminDashboardView;
