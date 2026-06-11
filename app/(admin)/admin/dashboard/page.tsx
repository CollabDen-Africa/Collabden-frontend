"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiUsers, FiCalendar, FiRefreshCw, FiCheckCircle } from "react-icons/fi";

interface WaitlistEntry {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("collabden_admin_waitlist");
      if (stored) {
        setWaitlist(JSON.parse(stored));
      }
    }
  }, []);

  // Compute platform stats
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome to the Admin Dashboard
          </h1>
          <p className="text-white/50 text-sm md:text-base font-medium max-w-xl">
            Select the Waitlist tab in the sidebar to view detailed information, search entries, manually add registrations, and export data.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 p-4 rounded-2xl bg-primary-green/10 border border-primary-green/20 text-primary-green">
          <FiCheckCircle size={24} />
          <span className="text-sm font-semibold tracking-wide">Secure Console Online</span>
        </div>
      </div>

      {/* General Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 font-semibold text-sm">Total Waitlist Users</span>
            <span className="p-3 bg-primary-blue/20 rounded-xl text-primary-blue"><FiUsers size={20} /></span>
          </div>
          <div className="text-3xl font-bold font-sans tracking-tight">{stats.total}</div>
          <div className="text-xs text-white/40 mt-1.5 font-medium">All-time early access signups</div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 font-semibold text-sm">Signups Today (24h)</span>
            <span className="p-3 bg-primary-green/20 rounded-xl text-primary-green"><FiCalendar size={20} /></span>
          </div>
          <div className="text-3xl font-bold font-sans tracking-tight">{stats.today}</div>
          <div className="text-xs text-white/40 mt-1.5 font-medium">New requests in last 24 hours</div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 font-semibold text-sm">Database Sync</span>
            <span className="p-3 bg-yellow-500/20 rounded-xl text-yellow-500"><FiRefreshCw size={20} className="animate-spin-slow" /></span>
          </div>
          <div className="text-xl font-bold font-sans tracking-tight">Active (Local)</div>
          <div className="text-xs text-white/40 mt-1.5 font-medium">Synced with local state</div>
        </div>
      </div>
    </div>
  );
}
